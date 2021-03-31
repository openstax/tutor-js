import { Map, getParentOf, modelize, computed, action, ID, hydrateModel, hydrateInstance } from 'shared/model'
import { find, last, sortBy, filter } from 'lodash'
import TaskPlan from './teacher/plan'
import type Course from '../course'
import Api from '../../api'

export
class TeacherTaskPlans extends Map<ID, TaskPlan> {


    constructor() {
        super();
        modelize(this);
    }

    get course() { return getParentOf<Course>(this) }

    get chainedValues() {
        return { course: this.course };
    }

    withPlanId(planId: ID, attributes = {}) {
        let plan = this.get(planId);
        if (!plan) {
            plan = new TaskPlan({ id: planId, course: this.course, ...attributes });
            this.set(planId, plan);
        }
        return plan;
    }

    addClone(planAttrs: any) {
        this.set(planAttrs.id, new TaskPlan({ ...planAttrs, course: this.course }));
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

    @computed get lastPublished() {
        return last(sortBy(filter(this.array, tp => tp.last_published_at), 'last_published_at'));
    }

    withPeriodId(periodId: ID) {
        return this.where(plan => find(plan.tasking_plans, { target_id: periodId }));
    }

    pastDueWithPeriodId(periodId) {
        return this.where(plan => plan.isPastDueWithPeriodId(periodId));
    }

    // called from api
    async fetch({ start_at, end_at }: { start_at: string, end_at: string }) {
        const data = await this.api.request<{ plans: TaskPlan[] }>(
            Api.fetchTaskPlans({ courseId: this.course.id }, { start_at, end_at })
        )
        this.onLoaded(data.plans)
        return this;
    }

    @action onLoaded(plans: TaskPlan[]) {
        plans.forEach(plan => {
            const tp = this.get(plan.id);
            tp ? hydrateInstance(tp, plan, this) : this.set(plan.id, hydrateModel(TaskPlan, { ...plan, course: this.course }, this);
        });
    }

}
