import { observable } from 'mobx';
import Map from 'shared/model/map';
import TaskPlan from './plan';

export
class PastTaskPlans extends Map {

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
    // remove any plans cached in the FE if they are not coming back from the BE
    const plansToRemove = this.array.filter(x => !items.some(s => s.id === x.id));
    plansToRemove.forEach(plan => this.delete(plan.id));

    items.forEach(plan => {
      const tp = this.get(plan.id);
      tp ? tp.update(plan) : this.set(plan.id, new TaskPlan({ ...plan, course: this.course }));
    });
  }

}
