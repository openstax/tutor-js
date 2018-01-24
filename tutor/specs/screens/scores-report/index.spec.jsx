import { React, SnapShot, Wrapper } from '../../components/helpers/component-testing';
import { map, sortBy } from 'lodash';
import bootstrapScores from '../../helpers/scores-data';
import EnzymeContext from '../../components/helpers/enzyme-context';
import Scores from '../../../src/screens/scores-report/index';
import Sorter from '../../../src/screens/scores-report/student-data-sorter';

function mockedContainerDimensions({ height = 1024, width = 1200 } = {}) {
  return ({ children, ...childProps }) => (
    React.cloneElement(children, { ...childProps, height, width })
  );
}
jest.mock('react-container-dimensions', () => mockedContainerDimensions());

const getStudentNames = function(wrapper) {
  return wrapper.find('.student-name').map(el => el.text());
};

describe('Scores Report', function() {

  let props;
  let course;
  let period;

  beforeEach(() => {

    ({ course, period } = bootstrapScores());
    props = {
      params: { courseId: course.id },
    };
  });

  afterEach(() => {
    course.scores.periods.clear();
  });

  it('renders', function() {
    const wrapper = mount(<Scores {...props} />, EnzymeContext.build());
    expect(getStudentNames(wrapper)).to.deep.equal(map(period.students, 'name'));
    wrapper.unmount();
  });

  // disabled because column widths are different when ran on travis, and not sure why
  xit('matches snapshot', () => {
    const scores = SnapShot.create(
      <Wrapper _wrapped_component={Scores} noReference {...props}/>
    );
    expect(scores.toJSON()).toMatchSnapshot();
    scores.unmount();
  });

  it('sorts', function() {
    const wrapper = mount(<Scores {...props} />, EnzymeContext.build());
    wrapper.find('.header-cell.sortable').at(1).simulate('click');
    const sorter = Sorter({ sort: { key: 0, dataType: 'score' }, displayAs: 'percentage' });
    const sorted = sortBy(period.students, sorter).reverse();
    expect(getStudentNames(wrapper)).to.deep.equal(map(sorted, 'name'));
    wrapper.find('.header-cell.sortable').at(1).simulate('click');
    expect(getStudentNames(wrapper)).to.deep.equal(map(sorted.reverse(), 'name'));
    wrapper.unmount();
  });

});
