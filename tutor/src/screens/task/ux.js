import { observable, computed, action, when, observe } from 'mobx';
import { reduce, filter, get, groupBy, map } from 'lodash';
import lazyGetter from 'shared/helpers/lazy-getter';
import Router from '../../../src/helpers/router';
import * as manipulations from './ux-task-manipulations';
import UiSettings from 'shared/model/ui-settings';
import StepGroup from '../../models/student-tasks/step-group';
import ScrollTo from '../../helpers/scroll-to';
import PageContentUX from './page-content-ux';
import CenterControls from '../../components/navbar/center-controls';

export default class TaskUX {

  // privateish
  @observable _stepIndex = 0;
  @observable viewedInfoSteps = [];

  constructor({ task, stepIndex = 0, history, windowImpl, course }) {
    this.history = history;
    this._task = task;
    this.window = windowImpl || window;
    this.course = course || task.tasksMap.course;
    this.becomeStudentIfNeeded();
    observe(this, 'currentStep', this.onStepChange, true);
    when(
      () => !this.task.api.isPendingInitialFetch,
      () => this.goToStep(stepIndex)
    );

  }

  @lazyGetter scroller = new ScrollTo({ windowImpl: this.window });
  @lazyGetter pageContentUX = new PageContentUX({ main: this });

  @action becomeStudentIfNeeded() {
    if (!this.course.roles.teacher) { return; }
    // if the teacher has reloaded while working student tasks
    // we need to restore it so the frame appears
    const teacherAsStudentRole = this.course.roles.find(r => {
      // use of == is deliberate so that it'll match both string and number ids
      return this._task.students.find(s => s.role_id == r.id);
    });
    if (teacherAsStudentRole) {
      // become the role, but do not reset the data so we
      // can re-use whatever is present.  Task is per-user,
      // so the data will be for this user
      teacherAsStudentRole.become({ reset: false });
    }
  }

  @action isUnmounting() {
    // value props
    CenterControls.currentTaskStep = null;
    this.viewedInfoSteps.forEach((type) => {
      const key = `has-viewed-${type}`;
      if (!UiSettings.get(key)) {
        UiSettings.set(key, { taskId: this.task.id });
      }
    });
  }

  @computed get manipulated() {
    return reduce(
      manipulations,
      (result, func) => func(result),
      { task: this._task, steps: this._task.steps },
    );
  }

  @computed get groupedSteps() {
    const { steps } = this.manipulated;
    if (this.task.isHomework) {
      return map(
        groupBy(steps, s => `${s.type}.${s.uid || s.id}`),
        (steps, uid) => steps.length > 1 ?
          new StepGroup({ steps, uid }) : steps[0]
      );
    }
    return steps;
  }

  @computed get steps() {
    return this.manipulated.steps;
  }

  @computed get milestoneSteps() {
    const firstNonCompleteI = this.steps.findIndex(s => !s.is_completed);
    if (-1 !== firstNonCompleteI) {
      return this.steps.slice(0, firstNonCompleteI + 1);
    }
    return this.steps;
  }

  @computed get task() {
    return this.manipulated.task;
  }

  @computed get controlButtons() {
    return [];
  }

  @action async onAnswerSave(step, answer) {
    step.answer_id = answer.id;
    step.is_completed = true;
    await step.save();

    if (
      step.multiPartGroup &&
      this.task.isFeedbackAvailable &&
      this._stepIndex > this.steps.indexOf(step)
    ) {
      // fixes the scroll position in case loading the feedback pushes the steps around
      this.scroller.scrollToSelector(
        `[data-task-step-id="${this.currentStep.id}"]`, { immediate: true }
      );
    }
  }

  @action moveToStep(step) {
    this._stepIndex = this.steps.indexOf(step);
  }

  @action onAnswerContinue(step) {
    this.moveToStep(step);
    if (this.canGoForward) {
      this.goForward();
    }
  }

  @action setCurrentMultiPartStep(step) {
    if (step.multiPartGroup) {
      // sets the current step to the step being answered and fixes the multipart breadcrumb
      // useful in case the user loads a multipart step and scrolls to a different step
      this.moveToStep(step);
    }
  }

  @action.bound onStepChange() {
    const step = this.currentStep;

    // events do not have steps
    if (!step) { return; }

    if (step.isPlaceHolder) {
      this.refetchTask();
    } else {
      if (step.multiPartGroup) {
        step.multiPartGroup.steps.forEach((s) => s.fetchIfNeeded());
      } else {
        step.fetchIfNeeded();
      }
    }
  }

  @action.bound async refetchTask() {
    const stepsLength = this.task.steps.length;
    await this.task.fetch();
    if (this.task.steps.length != stepsLength) {
      const unworkedIndex = this.steps.findIndex(s => !s.is_completed);
      this._stepIndex = unworkedIndex == -1 ? this.steps.length - 1: unworkedIndex;
    }
    this.currentStep.fetchIfNeeded();
  }

  @action.bound goBackward() {
    this.goToStep(this._stepIndex - 1);
  }

  @action.bound goForward() {
    this.goToStep(this._stepIndex + 1);
  }

  @action.bound goToStep(index, recordInHistory = true) {
    if (this.currentStep) {
      this.currentStep.markViewed();
    }

    const isChanged = this._stepIndex != index;
    this._stepIndex = index;

    CenterControls.currentTaskStep = this.currentStep;

    if (recordInHistory && isChanged) {
      this.history.push(
        Router.makePathname('viewTaskStep', {
          id: this.task.id,
          courseId: this.course.id,
          stepIndex: this._stepIndex + 1,
        }),
      );
      // schedule a scroll
      const sgi = this.stepGroupInfo;
      if (sgi.grouped) {
        this.scroller.scrollToSelector(
          `[data-task-step-id="${this.currentStep.id}"]`
        );
      }
    }
  }

  @computed get canGoForward() {
    if (this._stepIndex < this.steps.length - 1) {
      if (this.currentStep.isExercise) {
        return this.currentStep.is_completed;
      }
      return true;
    }
    return false;
  }

  @computed get canGoBackward() {
    return this._stepIndex > 0;
  }

  @computed get exerciseSteps() {
    return filter(this._task.steps, { isExercise: true });
  }

  questionNumberForStep(step) {
    if (this.task.isHomework && step.isExercise) {
      const index = this.exerciseSteps.indexOf(step);
      return -1 === index ? null : index + 1;
    }
    return null;
  }

  getCurrentStep({ grouped = true }) {
    if (!this.steps.length) { return null; }

    const step = this.steps[this._stepIndex];

    if (!grouped) {
      return step;
    }
    // translate to how it's grouped internally
    return this.groupedSteps.find((s) => {
      if (s === step) { return true; }
      if (s.isGrouped) { return s.includesStep(step); }
      return false;
    });
  }

  @computed get currentStep() {
    return this.getCurrentStep({ grouped: false });
  }

  @computed get currentGroupedStep() {
    return this.getCurrentStep({ grouped: true });
  }

  @computed get stepGroupInfo() {
    const step = this.steps[this._stepIndex];
    const group = this.groupedSteps.find((s) => {
      return s.isGrouped && s.includesStep(step);
    });
    if (group) {
      return {
        grouped: true, index: group.steps.indexOf(step),
      };
    }
    return { grouped: false };
  }

  @computed get previousStep() {
    return this.canGoBackward ?
      this.steps[this._stepIndex - 1] : null;
  }

  @computed get currentStepIndex() {
    return this._stepIndex;
  }

  @computed get nextStep() {
    return this.canGoForward ?
      this.steps[this._stepIndex + 1] : null;
  }

  @computed get relatedStepTitles() {
    if (!this.currentStep) { return {}; }
    return {
      previous: get(this.previousStep, 'preview'),
      current: this.currentStep.preview,
      next: get(this.nextStep, 'preview'),
    };
  }

  @computed get progressPercent() {
    return Math.round((this._stepIndex / this.steps.length) * 100);
  }

}
