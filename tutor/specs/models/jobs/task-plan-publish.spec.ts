import { Factory } from '../../helpers';
import TaskPlanPublish from '../../../src/models/jobs/task-plan-publish';
import TaskPlan from '../../../src/models/task-plans/teacher/plan';
import { autorun } from 'mobx';
import { hydrateModel } from 'modeled-mobx';

jest.useFakeTimers();

const PLAN_ID = 1;

describe('Task Plan Publish job', () => {

    let plan: TaskPlan;
    let job: TaskPlanPublish;

    beforeEach(() => {
        const course = Factory.course({ id: '2' })
        plan = hydrateModel(TaskPlan, {
            id: PLAN_ID,
            course,
        }, );
        job = TaskPlanPublish.forPlan(plan);
    });

    afterEach(() => {
        TaskPlanPublish._reset();
    });

    it('starts/stops listening', () => {
        expect(job.isPolling).toBe(false);
        plan.update({
            publish_job_url: 'foo/bar/123',
            is_publishing: true,
        } as any);
        job.requestJobStatus = jest.fn();
        const dispose = autorun(() => plan.publishing?.reportObserved());
        expect(plan.isPollable).toBe(true);
        expect(job.isPolling).toBe(true);
        jest.runAllTimers();
        expect(job.requestJobStatus).toHaveBeenCalledTimes(1);
        dispose();
        expect(job.isPolling).toBe(false);
    });

});
