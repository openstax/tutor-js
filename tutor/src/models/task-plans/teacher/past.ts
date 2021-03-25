import { observable } from 'mobx';
import Map from 'shared/model/map';
import TaskPlan from './plan';

export
class PastTaskPlans extends Map {

  @observable course;

  constructor(attrs) {
      super();
      modelize(this);
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
          tp ? tp.update(plan) : this.set(plan.id, new TaskPlan({ ...plan, course: this.course }));
      });
  }

}
