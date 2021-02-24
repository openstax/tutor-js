import { computed, observable, action } from 'mobx';
import { find } from 'lodash';
import Map from 'shared/model/map';
import TaskPlan from '../task-plans/teacher';

export default class CourseTaskPlans extends Map {

  @observable course;

  constructor(attrs) {
      super();
      this.course = attrs.course;
  }

  get chainedValues() {
      return { course: this.course };
  }

  withPlanId(planId, attributes = {}) {
      let plan = this.get(planId);
      if (!plan) {
          plan = new TaskPlan({ id: planId, ...attributes });
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
      return this.where(plan => !plan.is_deleting);
  }

  @computed get isPublishing() {
      return this.where(plan => plan.isPublishing);
  }

  @computed get hasPublishing() {
      return Boolean(find(this.array, 'isPublishing'));
  }

  @computed get reading() {
      return this.where(plan => plan.type === 'reading');
  }

  @computed get homework() {
      return this.where(plan => plan.type === 'homework');
  }

  @computed get pastDue() {
      return this.where(plan => plan.isPastDue);
  }

  @computed get open() {
      return this.where(plan => plan.isOpen);
  }

  withPeriodId(periodId) {
      return this.where(plan => find(plan.tasking_plans, { target_id: periodId }));
  }

  pastDueWithPeriodId(periodId) {
      return this.where(plan => plan.isPastDueWithPeriodId(periodId));
  }

  // called from api
  fetch() { }
  @action onLoaded({ data: { plans } }) {
      plans.forEach(plan => {
          const tp = this.get(plan.id);
          tp ? tp.update(plan) : this.set(plan.id, new TaskPlan(plan));
      });
  }

}
