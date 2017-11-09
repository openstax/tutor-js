import { SnapShot } from '../helpers/component-testing';
import TaskPlan from '../../../src/models/task-plan/teacher';
import planData from '../../../api/plans/1.json';
import statsData from '../../../api/plans/1/review.json';
import Exercise from '../../../src/components/task-teacher-review/exercise';


describe('Task Teacher Review', () => {
  let plan;
  let props;

  beforeEach(() => {
    plan = new TaskPlan();
    plan.onApiRequestComplete({ data: planData });
    plan.analytics.onApiRequestComplete({ data: statsData });

    props = {
      exercise: plan.analytics.stats[0].exercises[3],
    };
  });

  it('renders exercise', () => {
    const ex = mount(<Exercise {...props} />);
    expect(ex).toHaveRendered('Question');
  });

});
