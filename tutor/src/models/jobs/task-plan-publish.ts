import { modelize, ID } from 'shared/model';
import type { TeacherTaskPlan as TaskPlan } from '../../models'
import { observable, computed, reaction } from 'mobx';
import Job from '../job';

const CURRENT = observable.map<ID, TaskPlanPublishJob>();

export class TaskPlanPublishJob extends Job {

    static forPlan(plan: TaskPlan) {
        let pub = CURRENT.get(plan.id);
        if (!pub) {
            pub = new TaskPlanPublishJob(plan);
            CURRENT.set(plan.id, pub);
        }
        return pub;
    }

    static stopPollingForPlan(plan: TaskPlan) {
        const pub = CURRENT.get(plan.id);
        if (pub) {
            pub.stopListening();
            CURRENT.delete(plan.id);
        }
    }

    static hasPlanId(id: ID) {
        return CURRENT.has(id);
    }

    static isPublishing(plan: TaskPlan) {
        const pub = CURRENT.get(plan.id);
        return Boolean(pub ? pub.isPending : false);
    }

    static _reset() {
        CURRENT.clear();
    }

    @observable plan;

    @observable publishChangeListener?: () => void

    constructor(plan: TaskPlan) {
        super(); // every 10 seconds for max of 10 mins
        modelize(this);
        this.maxAttempts = 60
        this.interval = 10
        this.plan = plan;
    }

    stopListening() {
        if (this.publishChangeListener) {
            this.publishChangeListener();
            this.publishChangeListener = undefined;
            this.stopPolling();
        }
    }

    startListening() {
        if (this.publishChangeListener) { return; }
        this.publishChangeListener = reaction(
            () => this.shouldPoll,
            () => (this.shouldPoll && !this.isPolling) ?
                this.startPolling(this.plan?.publish_job_url) : this.stopPolling(),
            { fireImmediately: true }
        );
    }

    @computed get shouldPoll() {
        return Boolean(this.plan && this.plan.isPollable);
    }

    onPollComplete() {
        this.plan.onPublishComplete();
    }


}
