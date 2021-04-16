import { ID, action, modelize } from 'shared/model'
import Map, { getParentOf, hydrateModel } from 'shared/model/map';
//import {  from './plan';
import urlFor from '../../../api'
import type { Course } from '../../../models'
import { TeacherTaskPlan as TaskPlan, TeacherTaskPlanObj } from '../../../models'

export
class PastTaskPlans extends Map<ID, TaskPlan> {
    static Model = TaskPlan

    constructor() {
        super();
        modelize(this);
    }

    get course() { return getParentOf<Course>(this) }

    // called from api
    async fetch() {
        if (!this.course?.cloned_from_id) { return }
        const data = await this.api.request<{ items: TeacherTaskPlanObj[] }>(urlFor('fetchPastTaskPlans', { courseId: this.course.cloned_from_id }))
        this.onLoaded(data.items)
    }

    @action onLoaded(items: TeacherTaskPlanObj[]) {
        items.forEach((plan) => {
            const tp = this.get(plan.id);
            tp ? tp.update(plan) : this.set(plan.id, hydrateModel(TaskPlan, { ...plan, course: this.course }, this));
        });
    }

}
