import { React, SnapShot, Wrapper } from '../../components/helpers/component-testing';
import { map, sortBy } from 'lodash';
import Courses from '../../../src/models/courses-map';
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
      course,
      period,
    };
  });

  afterEach(() => {
    course.scores.periods.clear();
  });

  it('sorts', function() {
    const wrapper = mount(<Scores {...props} />, EnzymeContext.build());
    wrapper.find('.header-cell.sortable').at(1).simulate('click');
    const sorter = Sorter({ sort: { key: 0, dataType: 'score' }, displayAs: 'percentage' });
    const sorted = map(sortBy(period.students, sorter).reverse(), 'name');
    expect(getStudentNames(wrapper)).to.deep.equal(sorted);
    wrapper.find('.header-cell.sortable').at(1).simulate('click');
    expect(getStudentNames(wrapper)).to.deep.equal(sorted.reverse());
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

  it('renders', function() {
    const wrapper = mount(<Scores {...props} />, EnzymeContext.build());
    expect(getStudentNames(wrapper)).to.deep.equal(map(period.students, 'name'));
    wrapper.unmount();
  });

  it('displays empty', () => {
    course.scores.periods.get(course.scores.periods.keys()[0]).students.clear();
    const wrapper = mount(<Scores {...props} />, EnzymeContext.build());
    expect(wrapper.text())
      .toContain('there are no assignments to score');
    course.roles[0].type = 'student';
    expect(wrapper.text())
      .toContain('You don’t have any assignments yet. Once your instructor posts an assignment');
    wrapper.unmount();
  });

});
