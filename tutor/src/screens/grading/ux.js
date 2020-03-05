import { observable, action, computed } from 'vendor';
import { first } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';

export default class GradingUX {

  @observable isReady = false
  @observable selectedPeriod;

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
    this.isReady = true;
  }

  @action.bound setSelectedPeriod(period) {
    this.selectedPeriod = period;
  }

  @computed get stats() {
    return this.plan.analytics.stats.find(s => s.period_id == this.selectedPeriod.id);
  }
}
