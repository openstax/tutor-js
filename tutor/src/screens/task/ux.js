import { observable, runInAction, computed, action, when, observe, lazyGetter, modelize, hydrateModel } from 'shared/model'
import { reduce, filter, get, groupBy, map, find, invoke, last, isString } from 'lodash';
import Router from '../../../src/helpers/router';
import * as manipulations from './ux-task-manipulations';
import UiSettings from 'shared/model/ui-settings';
import { StudentTaskStepGroup as StepGroup } from '../../models';
import ScrollTo from '../../helpers/scroll-to';
import PageContentUX from './page-content-ux';


// pause for 1 second before allowing advancement to next step
const PAUSE_BEFORE_ADVANCEMENT_TIMEOUT = 1000;

export default class TaskUX {

    // privateish
    @observable _stepId ;
    @observable viewedInfoSteps = [];
    @observable isLocked = false;
    @observable hideTaskProgressTable = true;
    @observable hideToolbar = false;

    constructor({ task, stepId, history, windowImpl, course }) {
        modelize(this);
        this.history = history;
        this._task = task;
        this.window = windowImpl || window;
        this.course = course || task.tasksMap.course;
        this.becomeStudentIfNeeded();
        if (!stepId) {
            stepId = this.steps[0] && this.steps[0].id;
        }
        this._stepId = stepId;
        when(
            () => !this.task.api.isPending,
            () => {
                observe(this, 'currentStep', this.onStepChange, true);
                this.goToStepId(stepId);
            }
        );
        if (!this.course.currentRole.isTeacher) {
            this.course.practiceQuestions.fetch();
        }


        if (this.hasMultipleAttempts) {
            this.markIncorrectAttempt();
        }
    }

    @computed get canSaveToPractice() {
        return Boolean(
            this.task &&
        !this.course.currentRole.isTeacher && // a teacher can review students work
        !this.task.isPractice &&
        !this.currentStep.isWrittenResponseExercise
        );
    }

    @computed get hasMultipleAttempts() {
        return Boolean(
            this.task.allow_auto_graded_multiple_attempts &&
                this.task.isHomework
        );
    }

    @lazyGetter get scroller() { return new ScrollTo({ windowImpl: this.window }) }
    @lazyGetter get pageContentUX() { return new PageContentUX({ main: this }) }

    @action becomeStudentIfNeeded() {
        if (!this.course.roles.teacher) { return; }
        // if the teacher has reloaded while working student tasks
        // we need to restore it so the frame appears
        const teacherAsStudentRole = this.course.roles.find(r => {
            // use of == is deliberate so that it'll match both string and number ids
            return this._task.students.find(s => s.role_id == r.id);
        });

        if (teacherAsStudentRole && this.course.currentRole !== teacherAsStudentRole) {
            // become the role, but do not reset the data so we
            // can re-use whatever is present.  Task is per-user,
            // so the data will be for this user
            this.history.push({
                pathname: `/course/${this.course.id}/become/${teacherAsStudentRole.id}`,
                state: { returnTo: this.window.location.pathname },
            });
        }
    }

    @computed get isTeacher() {
        return this.course.currentRole.isTeacher;
    }

    @computed get isReadOnly() {
        return Boolean(
            this.isTeacher || this.currentStep.can_be_updated === false
        );
    }

    @action isUnmounting() {
        // value props

        if (this.currentStep) {
            this.currentStep.markViewed();
        }
        this.viewedInfoSteps.forEach((type) => {
            const key = `has-viewed-${type}`;
            if (!UiSettings.get(key)) {
                UiSettings.set(key, { taskId: this.task.id });
            }
        });
        if (this.isLocked) { clearTimeout(this.isLocked); }
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
                groupBy(steps, StepGroup.key),
                (steps, uid) => steps.length > 1 ?
                    hydrateModel(StepGroup, { steps, uid }, this.task) : steps[0]
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

    indexOfStep(step) {
        return this.steps.findIndex(s => s.id == step.id);
    }

    @computed get currentStepIndex() {
        return this.currentStep ? this.indexOfStep(this.currentStep) : -1;
    }

    @action async onAnswerSave(step, answer) {
        step.answer_id = answer.id;
        step.is_completed = true;
        await step.save();

        if (step.canAnswer && step.answer_id != step.correct_answer_id) {
            // If there are attempts left and the answer is wrong,
            // show it and soft reset state to allow reselecting
            step.markIncorrectAttempt();
            return false;
        }

        if (step.multiPartGroup && step.is_feedback_available && this.currentStepIndex > this.indexOfStep(step)) {
            // fixes the scroll position in case loading the feedback pushes the steps around
            this.scrollToCurrentStep(true);
        }
    }

    @action moveToStep(step) {
        this._stepId = step.id;
    }

    @action async onFreeResponseComplete(step, { wasModified = true } = {}) {
        if (!step.content.requiresAnswerId) {
            if ((!this.isTeacher) && step.can_be_updated && wasModified) {
                await step.save();
            }
            this.goForward();
        }
    }

    @action onAnswerContinue(step) {
        this.moveToStep(step);
        this.goForward();
    }

    @action setCurrentMultiPartStep(step) {
        if (step.multiPartGroup) {
            // sets the current step to the step being answered and fixes the multipart breadcrumb
            // useful in case the user loads a multipart step and scrolls to a different step
            this.moveToStep(step);
        }
    }

    @action.bound onStepChange() {
        const step = this.currentGroupedStep;

        // events do not have steps
        if (!step) { return; }

        if (step.isPlaceHolder) {
            this.refetchTask();
        } else {
            step.fetchIfNeeded();
        }
    }

    @computed get bestGuessStep() {
        return this.steps.find(s => !s.is_completed) || last(this.steps);
    }

    @action.bound async refetchTask() {
        await this.task.fetch();
        runInAction(() => {
            // current step might no longer exist
            if (!this.steps.find(s => s.id == this._stepId)) {
                this._stepId = this.bestGuessStep.id;
            }
            this.currentStep.fetchIfNeeded();
        });
    }

    @action.bound goBackward() {
        if (this.canGoBackward) {
            this.goToStep(this.steps[this.currentStepIndex - 1]);
        }
    }

    @action.bound goForward() {
        if (this.canGoForward) {
            if (this.nextStep.isInfo || !this.nextStep.is_completed) {
                this.isLocked = setTimeout(this.unLock, PAUSE_BEFORE_ADVANCEMENT_TIMEOUT);
            }
            this.goToStep(this.nextStep);
        }
    }

    @computed get canUpdateCurrentStep() {
        return Boolean(
            this.currentStep.can_be_updated && (!this.isTeacher)
        );
    }

    @action.bound unLock() {
        this.isLocked = false;
    }

    @action goToStepIndex(index, recordInHistory) {
        const step = this.steps[index];
        this.goToStep(step, recordInHistory);
    }

    @action.bound goToStepId(id, recordInHistory) {
        const step = this.steps.find(step => step.id == id);
        this.goToStep(step, recordInHistory);
    }

    @action.bound goToStep(step, recordInHistory = true) {
        // backwards compatibility when step is actually a string containing an step id
        if (isString(step)) {
            step = this.steps.find(s => s.id == step.id);
        }

        // do nothing if no step was given
        if (!step) { return; }

        // do nothing if the stepIndex hasn't changed
        if (this.currentStep && this.currentStep.id == step.id) { return; }

        // mark the current step as viewed before moving on, but only if the user is allowed to
        if (this.currentStep && this.canUpdateCurrentStep) {
            this.currentStep.markViewed();
        }

        const pathname = Router.makePathname('viewTaskStep', {
            id: this.task.id,
            courseId: this.course.id,
            stepId: step.id,
        });

        if (recordInHistory && this.history.location.pathname != pathname) {
            this.history.push(pathname);
        } else {
            this._stepId = step.id;
            const sgi = this.stepGroupInfo;
            if (sgi.grouped) {
                when(
                    () => !find(sgi.group.steps, 'needsFetched'),
                    () => this.scrollToCurrentStep(false),
                );
            }
        }
        if (this.hasMultipleAttempts) {
            this.markIncorrectAttempt();
        }
    }

    async scrollToCurrentStep(immediate) {
        const stepSelector = `[data-task-step-id="${this.currentStep.id}"]`;
        await this.scroller.scrollToSelector(stepSelector, { immediate, deferred: !immediate });
        invoke(document.querySelector(`${stepSelector} textarea`), 'focus');
    }

    @computed get isApiPending() {
        return this.task.api.isPending || get(this.currentStep, 'api.isPending', false);
    }

    @computed get canGoForward() {
        // last step of the assignment
        if (this.currentStepIndex >= this.steps.length - 1) return false;

        // something is currently loading, so wait for it to resolve before continuing
        if (!this.currentStep || this.isApiPending || this.isLocked) return false;

        // users can always go forward if they cannot update the current step
        // this covers closed assignments and teachers reviewing student work
        if (!this.canUpdateCurrentStep) return true;

        // students need to complete each exercise before they proceed
        if (this.currentStep.isExercise) return this.currentStep.is_completed;

        // other step types also need to be completed but they are auto-completed when continuing
        return true;
    }

    @computed get canGoBackward() {
        if (this.isApiPending) { return false; }

        return this.currentStepIndex > 0;
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
        const step = this.steps.find(s => s.id == this._stepId);

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
        const step = find(this.steps, { id: this._stepId  });
        const group = this.groupedSteps.find((s) => {
            return s.isGrouped && s.includesStep(step);
        });
        if (group) {
            return {
                grouped: true, group, index: group.steps.indexOf(step),
            };
        }
        return { grouped: false };
    }

    @computed get previousStep() {
        return this.currentStepIndex > 0 ? this.steps[this.currentStepIndex - 1] : null;
    }

    @computed get nextStep() {
        return this.currentStepIndex < this.steps.length - 1 ? this.steps[this.currentStepIndex + 1] : null;
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
        return Math.round((this.currentStepIndex / this.steps.length) * 100);
    }

    @action.bound toggleTaskProgressTable() {
        this.hideTaskProgressTable = !this.hideTaskProgressTable;
    }

    @action.bound toggleTaskToolbar() {
        this.hideToolbar = !this.hideToolbar;
    }

    @action.bound markIncorrectAttempt() {
        const step = this.currentStep;
        if (
            !this.isTeacher && // Teachers reviewing assignments don't get the UI to re-answer
            step.canAnswer &&
            step.answer_id &&
            step.answer_id != step.correct_answer_id
        ) {
            // If the page was reloaded or step changed after an incorrect attempt, but
            // there are attempts remaining, match the state as if it wasn't reloaded
            step.markIncorrectAttempt();
        }
    }

    canShuffleQuestionAnswers(question) {
        return this.task.shuffle_answer_choices &&
               this.currentStep.attempt_number == 0 &&
               question.answers.length > 2 &&
              !question.is_answer_order_important
    }

    @action shuffleQuestionAnswers(question) {
        const { answers } = question;

        // https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#The_modern_algorithm
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }

        this.currentStep.answer_id_order = answers.map(a => a.id);

        return question;
    }

    useAnswerIdOrder(question) {
        // Only use the answer_id_order if the order isn't important and
        // was previously submitted & saved with the first attempt
        return !question.is_answer_order_important && this.currentStep.attempt_number > 0;
    }
}
