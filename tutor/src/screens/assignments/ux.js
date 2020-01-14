import { observable, computed, action } from 'mobx';
import ScrollTo from '../../helpers/scroll-to';
import Exercises from '../../models/exercises';
import TaskPlan, { SELECTION_COUNTS } from '../../models/task-plans/teacher/plan';
import ReferenceBook from '../../models/reference-book';

import details from './details';
import chapters from './chapters';
import questions from './questions';
import review from './review';
import UnknownType from './unknown';
const STEPS = {
  details,
  chapters,
  questions,
  review,
};

const STEP_IDS = Object.keys(STEPS);

export default class AssignmentUX {

  @observable _stepIndex = 0;
  @observable isShowingSectionSelection = false;
  @observable isShowingExercises = false;
  @observable isShowingExerciseReview = false;
  @observable isShowingPeriodTaskings;
  @observable exercises;
  @observable isReady = false;
  @observable sourcePlanId;


  constructor(attrs = null) {
    if (attrs) { this.initialize(attrs); }
  }

  @action async initialize({
    id, type, plan, course, onComplete, // due_at,
    exercises = Exercises,
    windowImpl = window,
  }) {
    if ('clone' === type) {
      if (!course.pastTaskPlans.api.hasBeenFetched) {
        await course.pastTaskPlans.fetch();
      }
      this.sourcePlanId = id;
      this.plan = course.pastTaskPlans.get(id).createClone({ course });
    } else {
      if (plan) {
        this.plan = plan;
      } else {
        this.plan = new TaskPlan({ id, course, type });
        if (id && id != 'new') {
          const existing = course.teacherTaskPlans.get(id);
          if (existing) {
            this.plan.update( existing.serialize() );
          }
        }
      }
      if (type) {
        this.plan.type = type;
      }
    }

    this.course = course;

    if (this.plan.isNew) {
      // const opens_at = calculateDefaultOpensAt({ course: this.course });
      // this.periods.map((period) =>
      //   this.plan.findOrCreateTaskingForPeriod(period, { opens_at }),
      // );
      // if (due_at) {
      //   this.plan.tasking_plans.forEach(tp => tp.initializeWithDueAt(due_at));
      // }
    } else {
      await this.plan.ensureLoaded();
    }

    this.onComplete = onComplete;
    this.exercises = exercises;
    if (this.plan.isReading) {
      await this.referenceBook.ensureLoaded();
    }
    this.windowImpl = windowImpl;

    this.isShowingPeriodTaskings = !(this.canSelectAllSections && this.plan.areTaskingDatesSame);

    this.scroller = new ScrollTo({ windowImpl });

    this.isReady = true;
  }

  @computed get isInitializing() {
    return !this.isReady || !this.plan || this.plan.api.isPendingInitialFetch;
  }

  get referenceBook() {
    if (this._referenceBook) {
      return this._referenceBook;
    }
    if (this.plan.ecosystem_id && this.plan.ecosystem_id != this.course.ecosystem_id) {
      this._referenceBook = new ReferenceBook({ id: this.plan.ecosystem_id });
    } else {
      this._referenceBook = this.course.referenceBook;
    }
    return this._referenceBook;
  }

  @computed get isApiPending() {
    return this.plan.api.isPending;
  }

  @computed get StepComponent() {
    return STEPS[STEP_IDS[this._stepIndex]] || UnknownType;
  }

  @action.bound goForward() {
    if (this.canGoForward) {
      // TODO, skip steps if the assignment type doesn't need the next,
      // for instance events won't have chapters & questiosn
      this.goToStep(this._stepIndex + 1);
    }
  }

  @action.bound goBackward() {
    if (this.canGoBackward) {
      this.goToStep(this._stepIndex - 1);
    }
  }

  @computed get canGoForward() {
    return Boolean(
      !this.isApiPending && this._stepIndex < STEP_IDS.length - 1
    );
  }

  @computed get canGoBackward() {
    return Boolean(
      this.isApiPending && this._stepIndex > 0
    );
  }

}
