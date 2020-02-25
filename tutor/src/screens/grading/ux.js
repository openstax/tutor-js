import { observable, action } from 'vendor';
import ScrollTo from '../../helpers/scroll-to';

export default class GradingUX {

  @observable isReady = false

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

    await this.plan.ensureLoaded();

    // once templates is loaded, select ones of the correct type
    await gradingTemplates.ensureLoaded();

    await this.plan.exercisesMap.ensureExercisesLoaded({ course, exercise_ids: this.plan.exerciseIds });

    this.isReady = true;
  }

}
