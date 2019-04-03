import { observable, computed, action, when } from 'mobx';
import { reduce, get, groupBy, map } from 'lodash';
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

  constructor({ task, stepIndex = 0, router, windowImpl, course }) {
    this.router = router;
    this._task = task;
    this._task.fetch();
    this.window = windowImpl || window;
    this.course = course || task.tasksMap.course;

    when(
      () => !this.task.api.isPendingInitialFetch,
      () => this.goToStep(stepIndex)
    );
  }

  @lazyGetter scroller = new ScrollTo({ windowImpl: this.window });
  @lazyGetter pageContentUX = new PageContentUX({ main: this });

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

  @computed get steps() {
    const { steps } = this.manipulated;
    if (this.task.isHomework) {
      return map(
        groupBy(steps, s => `${s.type}.${s.uid}`),
        (steps, uid) => steps.length > 1 ?
          new StepGroup({ steps, uid }) : steps[0]
      );
    }
    return steps;
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
    await step.save();
    // don't advance there's feedback so the user can view it
    if (!this.task.isFeedbackAvailable) {
      this.onAnswerContinue(step);
    }
  }

  @action onAnswerContinue(step) {
    // scroll if it's a MPQ but not the last one
    if (step.multiPartGroup) {
      const nextStep = step.multiPartGroup.getStepAfter(step);
      if (nextStep) {
        this.scroller.scrollToSelector(`[data-task-step-id="${nextStep.id}"]`);
      }
    }

    if (this.canGoForward) {
      this.goForward();
    }
  }

  @action.bound goBackward() {
    this.goToStep(this._stepIndex - 1);
  }

  @action.bound goForward() {
    this.goToStep(this._stepIndex + 1);
  }

  @action.bound goToStep(index, recordInHistory = true) {
    // mark current step complete if it's auto
    if (this.currentStep) {
      this.currentStep.markViewed();
    }

    const isChanged = this._stepIndex != index;
    this._stepIndex = Number(index);

    CenterControls.currentTaskStep = this.currentStep;

    if (recordInHistory && isChanged) {
      this.router.history.push(
        Router.makePathname('viewTaskStep', {
          id: this.task.id,
          courseId: this.course.id,
          stepIndex: this.currentStepIndex + 1,
        }),
      );
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

  @computed get currentStepIndex() {
    return this._stepIndex;
  }

  @computed get currentStep() {
    return this.steps[this._stepIndex];
  }

  @computed get previousStep() {
    return this.canGoBackward ?
      this.steps[this._stepIndex - 1] : null;
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
