import { ID, action, observable, modelize } from 'shared/model'
import Map from 'shared/model/map';
import TaskPlan from './plan';
import Api from '../../../api'

export
class PastTaskPlans extends Map<ID, TaskPlan> {

    @observable course;

    constructor(attrs: any) {
        super();
        modelize(this);
        this.course = attrs.course;
    }

    // called from api
    async fetch() {
        if (!this.course.isCloned) { return }
        const data = this.api.request(Api.fetchPastTaskPlans({ courseId: this.course.cloned_from_id }))
        this.onLoaded(data)
    }
    @action onLoaded({ items }: any) {
        items.forEach((plan: any) => {
            const tp = this.get(plan.id);
            tp ? tp.update(plan) : this.set(plan.id, new TaskPlan({ ...plan, course: this.course }));
        });
    }

}
