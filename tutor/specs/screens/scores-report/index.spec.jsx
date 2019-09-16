import { R } from '../../helpers';
import { map, sortBy } from 'lodash';
import bootstrapScores from '../../helpers/scores-data';
import Scores from '../../../src/screens/scores-report/index';
import Sorter from '../../../src/screens/scores-report/student-data-sorter';
import UX from '../../../src/screens/scores-report/ux';

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
    const ux = new UX(course);
    ux.windowSize = { width: 800, height: 1024 };
    props = {
      ux,
      params: { courseId: course.id },
      course,
      period,
    };
  });

  it('sorts', function() {
    const wrapper = mount(<R><Scores {...props} /></R>);

    wrapper.find('.header-cell.sortable').at(1).simulate('click');
    const sorter = Sorter({ sort: { key: 0, dataType: 'score' }, displayAs: 'percentage' });
    const sorted = map(sortBy(period.students, sorter).reverse(), 'name');
    expect(getStudentNames(wrapper)).toEqual(sorted);
    wrapper.find('.header-cell.sortable').at(1).simulate('click');
    expect(getStudentNames(wrapper)).toEqual(sorted.reverse());
    wrapper.unmount();
  });

  // disabled because column widths are different when ran on travis, and not sure why
  // it('matches snapshot', () => {
  //   expect.snapshot(<C><Scores {...props} /></C>).toMatchSnapshot();
  // });

  it('renders', function() {
    const wrapper = mount(<R><Scores {...props} /></R>);
    expect(getStudentNames(wrapper)).toEqual(map(period.students, 'name'));
    wrapper.unmount();
  });

  it('displays empty', () => {
    course.scores.periods.get(course.scores.periods.keys()[0]).students.clear();
    const wrapper = mount(<R><Scores {...props} /></R>);
    expect(wrapper.text())
      .toContain('there are no assignments to score');
    course.roles[0].type = 'student';
    expect(wrapper.text())
      .toContain('You don’t have any assignments yet. Once your instructor posts an assignment');
    wrapper.unmount();
  });

});
