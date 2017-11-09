import { React, SnapShot, Wrapper } from '../helpers/component-testing';
import bootstrapScores from '../../helpers/scores-data.js';

import Header from '../../../src/components/scores/assignment-header';

describe('Scores Report: assignment column header', function() {
  let props;
  let heading;
  beforeEach(function() {
    const { course, period } = bootstrapScores();
    heading = period.data_headings[0];
    props = {
      courseId: course.id,
      columnIndex: 0,
      onSort: jest.fn(),
      sort: {},
      period,
    };
  });

  it('renders and matches snapshot', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.find('.header-cell.title').render().text()).toEqual(heading.title);
    expect(wrapper).toHaveRendered('Time');
    expect(SnapShot.create(
      <Wrapper _wrapped_component={Header} noReference={true} {...props} />).toJSON()
    ).toMatchSnapshot();
  });

  describe('for a CC course', function() {
    let wrapper;
    beforeEach(function() {
      props.isConceptCoach = true;
      wrapper = shallow(<Header {...props} />);
    });

    it('sets className', function() {
      expect(wrapper).toHaveRendered('.header-cell.cc');
    });

    it('hides due date', function() {
      expect(wrapper).not.toHaveRendered('Time');
    });

    it('matches snapshot', function() {
      expect(SnapShot.create(
        <Wrapper _wrapped_component={Header} noReference={true} {...props} />).toJSON()
      ).toMatchSnapshot();
    });
  });
});
