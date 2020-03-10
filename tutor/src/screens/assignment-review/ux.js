import { observable, action, computed } from 'vendor';
import { first } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';
import ScoresUX from './scores-ux';

export default class GradingUX {

  @observable isReady = false
  @observable selectedPeriod;

  scores = new ScoresUX(this);

  constructor(attrs = null) {
    if (attrs) { this.initialize(attrs); }
  }

  @action async initialize({
    id, plan, course,
    gradingTemplates = course.gradingTemplates,
    windowImpl = window,
  }) {
    this.scroller = new ScrollTo({ windowImpl });
    this.plan = plan || course.teacherTaskPlans.withPlanId(id);
    this.course = course;
    this.selectedPeriod = first(course.periods.active);

    await this.plan.ensureLoaded();
    await this.plan.analytics.fetchReview();
    await gradingTemplates.ensureLoaded();
    await this.plan.exercisesMap.ensureExercisesLoaded({ course, exercise_ids: this.plan.exerciseIds });
    await this.course.roster.ensureLoaded();

    this.isReady = true;
  }

  @action.bound setSelectedPeriod(period) {
    this.selectedPeriod = period;
  }

  @computed get students() {
    return this.course.roster.students;
  }

}
