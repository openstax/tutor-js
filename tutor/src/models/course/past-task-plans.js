import { computed, observable, action } from 'mobx';
import { find } from 'lodash';
import Map from 'shared/model/map';
import TaskPlan from '../task-plan/teacher';

export default class CoursePastTaskPlans extends Map {

  @observable course;

  constructor(attrs) {
    super();
    this.course = attrs.course;
  }

  // called from api
  fetch() {
    if (!this.course.isCloned) { return 'ABORT'; }
    return { id: this.course.cloned_from_id };
  }
  onLoaded({ data: { items } }) {
    items.forEach(plan => {
      const tp = this.get(plan.id);
      tp ? tp.update(plan) : this.set(plan.id, new TaskPlan(plan));
    });
  }

}
