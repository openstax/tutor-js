import TaskPlanPublish from '../../../src/models/jobs/task-plan-publish';
import TaskPlan from '../../../src/models/teacher-task-plan';
jest.useFakeTimers();
const PLAN_ID = 1;

describe('Task Plan Publish job', () => {

  let plan;
  let job;

  beforeEach(() => {
    plan = new TaskPlan({
      id: PLAN_ID,
    });
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
    });
    job.requestJobStatus = jest.fn();
    expect(job.isPolling).toBe(true);
    jest.runAllTimers();
    expect(job.requestJobStatus).toHaveBeenCalledTimes(1);
    plan.is_publishing = false;
    expect(job.isPolling).toBe(false);
  });

});
