import { React, SnapShot } from '../../components/helpers/component-testing';

const COURSE_ID = '1';
import bootstrapScores from '../../helpers/scores-data.js';
import DATA from '../../../api/courses/1/performance.json';
import PieProgress from '../../../src/screens/scores-report/pie-progress';
import TH from '../../../src/helpers/task';

jest.mock('../../../src/helpers/task');

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
    TH.getCompletedPercent.mockImplementation(() => 40);
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).toHaveRendered('g#q1');
    expect(wrapper).not.toHaveRendered('g#q2');
    expect(wrapper).not.toHaveRendered('g#q3');
    expect(wrapper).not.toHaveRendered('g#q4');
    expect(SnapShot.create(<PieProgress {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders 50% > 75% quarters', function() {
    TH.getCompletedPercent.mockImplementation(() => 54);
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).not.toHaveRendered('g#q1');
    expect(wrapper).toHaveRendered('g#q2');
    expect(wrapper).not.toHaveRendered('g#q3');
    expect(wrapper).not.toHaveRendered('g#q4');
    expect(SnapShot.create(<PieProgress {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders 75% > 100% quarters', function() {
    TH.getCompletedPercent.mockImplementation(() => 78);
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).not.toHaveRendered('g#q1');
    expect(wrapper).not.toHaveRendered('g#q2');
    expect(wrapper).toHaveRendered('g#q3');
    expect(wrapper).not.toHaveRendered('g#q4');
    expect(SnapShot.create(<PieProgress {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders 100% quarters', function() {
    TH.getCompletedPercent.mockImplementation(() => 100);
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).not.toHaveRendered('g#q1');
    expect(wrapper).not.toHaveRendered('g#q2');
    expect(wrapper).not.toHaveRendered('g#q3');
    expect(wrapper).toHaveRendered('g#q4');
    expect(SnapShot.create(<PieProgress {...props} />).toJSON()).toMatchSnapshot();
  });
});
