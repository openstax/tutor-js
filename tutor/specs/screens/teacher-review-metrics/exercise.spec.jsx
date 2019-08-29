import { Factory } from '../../helpers';
import Exercise from '../../../src/screens/teacher-review-metrics/exercise';


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
