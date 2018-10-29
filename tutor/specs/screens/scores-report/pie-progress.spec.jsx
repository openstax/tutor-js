import { React, SnapShot } from '../../helpers';

const COURSE_ID = '1';
import bootstrapScores from '../../helpers/scores-data.js';
import DATA from '../../../api/courses/1/performance.json';
import PieProgress from '../../../src/screens/scores-report/pie-progress';


describe('Scores Report: pie progress SVG icon', function() {
  let task;
  let props;
  beforeEach(function() {
    let { scores } = bootstrapScores();
    task = scores.getTask(18);
    props = {
      task,
    };
  });

  it('renders < 50% quarters', function() {
    task.completed_on_time_step_count = 5;
    task.step_count = 15;
    expect(task.completedPercent).toEqual(33);
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).toHaveRendered('g#q1');
    expect(wrapper).not.toHaveRendered('g#q2');
    expect(wrapper).not.toHaveRendered('g#q3');
    expect(wrapper).not.toHaveRendered('g#q4');
    expect.snapshot(<PieProgress {...props} />).toMatchSnapshot();
  });

  it('renders 50% > 75% quarters', function() {
    task.completed_on_time_step_count = 5;
    task.step_count = 10;
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).not.toHaveRendered('g#q1');
    expect(wrapper).toHaveRendered('g#q2');
    expect(wrapper).not.toHaveRendered('g#q3');
    expect(wrapper).not.toHaveRendered('g#q4');
    expect.snapshot(<PieProgress {...props} />).toMatchSnapshot();
  });

  it('renders 75% > 100% quarters', function() {
    task.completed_on_time_step_count = 8;
    task.step_count = 10;
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).not.toHaveRendered('g#q1');
    expect(wrapper).not.toHaveRendered('g#q2');
    expect(wrapper).toHaveRendered('g#q3');
    expect(wrapper).not.toHaveRendered('g#q4');
    expect.snapshot(<PieProgress {...props} />).toMatchSnapshot();
  });

  it('renders 100% quarters', function() {
    task.completed_on_time_step_count = 10;
    task.step_count = 10;
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).not.toHaveRendered('g#q1');
    expect(wrapper).not.toHaveRendered('g#q2');
    expect(wrapper).not.toHaveRendered('g#q3');
    expect(wrapper).toHaveRendered('g#q4');
    expect.snapshot(<PieProgress {...props} />).toMatchSnapshot();
  });
});
