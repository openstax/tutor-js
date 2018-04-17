import { SnapShot } from '../helpers/component-testing';
import Factory, { FactoryBot } from '../../factories';
import TaskPlan from '../../../src/models/task-plan/teacher';
import planData from '../../../api/plans/1.json';
import statsData from '../../../api/plans/1/review.json';
import Exercise from '../../../src/components/task-teacher-review/exercise';


describe('Task Teacher Review', () => {

  let stat, course, props;

  beforeEach(() => {
    course = Factory.course();
    stat = Factory.taskPlanStat({ course });
    const exercise = stat.stats[0].current_pages[0].exercises[0];
    props = { exercise };
  });

  it('renders exercise', async () => {
    const wrapper = mount(<Exercise {...props} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(wrapper).toHaveRendered('Question');
  });

});
