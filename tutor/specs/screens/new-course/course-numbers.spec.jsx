import { React, SnapShot } from '../../components/helpers/component-testing';
import CourseNumbers from '../../../src/screens/new-course/course-numbers';
import BuilderUX from '../../../src/screens/new-course/ux';
import { bootstrapCoursesList } from '../../courses-test-data';

jest.mock('../../../src/models/course/offerings', () => ({
  fetch: jest.fn(),
  get: jest.fn(() => ({ is_available: true })),
}));

const COURSE_ID = '1';

jest.mock('../../../src/models/user', () => ({
  isCollegeTeacher: true,
}));

describe('CreateCourse: entering details', function() {

  let ux;
  let courses;

  beforeEach(() => {
    const route = { match: { params: { } } };

    courses = bootstrapCoursesList();
    ux = new BuilderUX({ route });
  });

  it('is accessible', async () => {
    const wrapper = mount(<CourseNumbers ux={ux} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.unmount();
  });

  it('sets field values', function() {
    ux.newCourse.cloned_from = courses.get(COURSE_ID);
    const wrapper = shallow(<CourseNumbers ux={ux} />);
    expect(wrapper).toHaveRendered('.course-details-sections FormControl[type="number"][defaultValue=0]');
    wrapper.unmount();
  });

  it('updates values when edited', function() {
    const wrapper = mount(<CourseNumbers ux={ux} />);
    wrapper.find('.course-details-numbers .form-control')
      .simulate('change', { target: { value: 3 } });
    wrapper.find('.course-details-sections .form-control')
      .simulate('change', { target: { value: 12 } });
    expect(ux.newCourse.estimated_student_count).toEqual(3);
    expect(ux.newCourse.num_sections).not.toEqual(12);
    wrapper.find('.course-details-sections .form-control')
      .simulate('change', { target: { value: 3 } });
    expect(ux.newCourse.num_sections).toEqual(3);
    wrapper.unmount();
  });

  it('matches snapshot', function() {
    const component = SnapShot.create(<CourseNumbers ux={ux} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });
});
