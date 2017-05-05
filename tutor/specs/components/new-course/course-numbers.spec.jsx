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
    expect(wrapper).toHaveRendered('.course-details-sections FormControl[type="number"][value=0]');
    ux.newCourse.estimated_student_count = 4;
    expect(wrapper).toHaveRendered('.course-details-numbers FormControl[type="number"][value=4]');
  });


  it('updates flux values when edited', function() {
    const wrapper = mount(<CourseNumbers ux={ux} />);
    wrapper.find('.course-details-numbers .form-control')
           .simulate('change', { target: { value: 3 } });
    wrapper.find('.course-details-sections .form-control')
           .simulate('change', { target: { value: 12 } });
    expect(ux.newCourse.estimated_student_count).toEqual(3);
    expect(ux.newCourse.num_sections).toEqual(12);
  });


  it('matches snapshot', function() {
    const component = SnapShot.create(<CourseNumbers ux={ux} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
