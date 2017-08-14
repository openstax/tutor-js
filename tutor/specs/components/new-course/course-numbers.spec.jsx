import { React, SnapShot } from '../helpers/component-testing';

import CourseNumbers from '../../../src/components/new-course/course-numbers';
import BuilderUX from '../../../src/models/course/builder-ux';
const COURSE_ID = '1';
import { bootstrapCoursesList } from '../../courses-test-data';

describe('CreateCourse: entering details', function() {

  let ux;
  let courses;
  beforeEach(() => {
    courses = bootstrapCoursesList();
    ux = new BuilderUX();
  });

  it('sets field values', function() {
    ux.newCourse.cloned_from = courses.get(COURSE_ID);
    const wrapper = shallow(<CourseNumbers ux={ux} />);
    expect(wrapper).toHaveRendered('.course-details-sections FormControl[type="number"][defaultValue=0]');
  });


  it('updates values when edited', function() {
    const wrapper = mount(<CourseNumbers ux={ux} />);
    wrapper.find('.course-details-numbers .form-control')
           .simulate('change', { target: { value: 3 } });
    wrapper.find('.course-details-sections .form-control')
           .simulate('change', { target: { value: 12 } });
    expect(ux.newCourse.estimated_student_count).toEqual(3);
    expect(ux.newCourse.num_sections).not.toEqual(12);
    expect(SnapShot.create(<CourseNumbers ux={ux} />).toJSON()).toMatchSnapshot();
    wrapper.find('.course-details-sections .form-control')
           .simulate('change', { target: { value: 3 } });
    expect(ux.newCourse.num_sections).toEqual(3);
    expect(SnapShot.create(<CourseNumbers ux={ux} />).toJSON()).toMatchSnapshot();
  });


  it('matches snapshot', function() {
    const component = SnapShot.create(<CourseNumbers ux={ux} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
