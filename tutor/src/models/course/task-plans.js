import { computed, observable, action } from 'mobx';
import Map from '../map';
import TaskPlan from '../task-plan/teacher';

import {
  BaseModel, identifiedBy, identifier, field, session, belongsTo,
} from '../base';

// let TaskPlans;

const DELETED = observable.map();

export default class CourseTaskPlans extends Map {

  @observable course;

  constructor(attrs) {
    super();
    this.course = attrs.course;
  }

  get chainedValues() {
    return { course: this.course };
  }

  //  get courseId() { return this.course.id; }

  withPlanId(planId) {
    let plan = this.get(planId);
    if (!plan) {
      plan = new TaskPlan({ id: planId });
      this.set(planId, plan);
    }
    return plan;
  }

  @action onPlanSave(oldId, planAttrs) {
    let tp = this.get(oldId);
    if (tp) {
      tp.update(planAttrs);
    } else {
      tp = new TaskPlan(planAttrs);
    }
    this.set(planAttrs.id, tp);
    if (oldId != tp.id) {
      this.delete(oldId);
    }
  }

  addClone(planAttrs) {
    this.set(planAttrs.id, new TaskPlan(planAttrs));
  }

  @computed get active() {
    return this.where(plan => !DELETED.has(plan.id) && !plan.is_deleting);
  }

  @computed get isPublishing() {
    return this.where(plan => plan.is_publishing);
  }

  @computed get hasPublishing() {
    return this.isPublishing.any;
  }

  @computed get reading() {
    return this.where(plan => plan.type === 'reading');
  }

  @computed get homework() {
    return this.where(plan => plan.type === 'homework');
  }

  // called from api
  fetch() { }
  onLoaded({ data: { plans } }) {
    plans.forEach(plan => {
      const tp = this.get(plan.id);
      tp ? tp.update(plan) : this.set(plan.id, new TaskPlan(plan));
    });
  }

}

//
// class TeacherTaskPlans extends Map {
//
//   forCourseId(courseId) {
//     let courseMap = this.get(courseId);
//     if (!courseMap) {
//       courseMap = new CourseTaskPlans(courseId);
//       this.set(courseId, courseMap);
//     }
//     return courseMap;
//   }
//
//   // note: the response also contains course, tasks and role but they're currently unused
//
//   clear() {
//     super.clear();
//     DELETED.clear();
//   }
//
// }
//
// TaskPlans = new TeacherTaskPlans();
// export default TaskPlans;
