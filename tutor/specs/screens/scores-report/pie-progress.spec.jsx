import { React, SnapShot } from '../../components/helpers/component-testing';

const COURSE_ID = '1';
import DATA from '../../../api/courses/1/performance.json';

import PieProgress from '../../../src/screens/scores-report/pie-progress';

describe('Scores Report: pie progress SVG icon', function() {
  let props;
  beforeEach(function() {
    props = {
      isConceptCoach: false,
      size: 28,
      value: 28,
    };
  });


  it('renders < 50% quarters', function() {
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).toHaveRendered('g#q1');
    expect(wrapper).not.toHaveRendered('g#q2');
    expect(wrapper).not.toHaveRendered('g#q3');
    expect(wrapper).not.toHaveRendered('g#q4');
    expect(SnapShot.create(<PieProgress {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders 50% > 75% quarters', function() {
    props.value = 58;
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).not.toHaveRendered('g#q1');
    expect(wrapper).toHaveRendered('g#q2');
    expect(wrapper).not.toHaveRendered('g#q3');
    expect(wrapper).not.toHaveRendered('g#q4');
    expect(SnapShot.create(<PieProgress {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders 75% > 100% quarters', function() {
    props.value = 78;
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).not.toHaveRendered('g#q1');
    expect(wrapper).not.toHaveRendered('g#q2');
    expect(wrapper).toHaveRendered('g#q3');
    expect(wrapper).not.toHaveRendered('g#q4');
    expect(SnapShot.create(<PieProgress {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders 100% quarters', function() {
    props.value = 100
    const wrapper = shallow(<PieProgress {...props} />);
    expect(wrapper).not.toHaveRendered('g#q1');
    expect(wrapper).not.toHaveRendered('g#q2');
    expect(wrapper).not.toHaveRendered('g#q3');
    expect(wrapper).toHaveRendered('g#q4');
    expect(SnapShot.create(<PieProgress {...props} />).toJSON()).toMatchSnapshot();
  });
});
