import { Router, Factory } from '../../helpers';
import Exercise from '../../../src/screens/teacher-review-metrics/exercise';


xdescribe('Task Teacher Review: Review Exercises', () => {

  let stat, course, props;

  beforeEach(() => {
    course = Factory.course();
    stat = Factory.taskPlanStat({ course });
    const exercise = stat.stats[0].current_pages[0].exercises[0];
    props = { exercise, course };
  });

  it('renders exercise', async () => {
    const wrapper = mount(<Router><Exercise {...props} /></Router>);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(wrapper).toHaveRendered('Question');
  });

});
