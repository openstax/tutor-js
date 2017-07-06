import { Wrapper, SnapShot } from './helpers/component-testing';

import App from '../../src/components/app';
import User from '../../src/models/user';
import ChangeStudentId from '../../src/components/change-student-id';
import { bootstrapCoursesList } from '../courses-test-data';
import EnzymeContext from './helpers/enzyme-context';
import Router from '../../src/helpers/router';
jest.mock('../../src/helpers/router');

describe('Change Student ID', () => {
  let params, courses;

  beforeEach(() => {
    params = { courseId: '1' };
    courses = bootstrapCoursesList();
    Router.currentParams.mockReturnValue(params);
    Router.makePathname.mockReturnValue('go-to-dash');
    Router.currentMatch.mockReturnValue({ entry: { name: 'joinStudentId' }, params });
  });

  it('renders and matches snapshot for various states', () => {
    expect(SnapShot.create(<ChangeStudentId />).toJSON()).toMatchSnapshot();
    Router.currentMatch.mockReturnValue({ entry: { name: 'updateStudentId' }, params });
    expect(SnapShot.create(<ChangeStudentId />).toJSON()).toMatchSnapshot();
  });

  it('updates student id when edited', () => {
    const form = mount(<ChangeStudentId />, EnzymeContext.build());
    const course = courses.get(params.courseId);
    course.student.save = jest.fn(() => Promise.resolve({}));
    form.find('input').get(0).value = '4252';
    form.find('.btn-primary').simulate('click');
    expect(course.student.student_identifier).toEqual('4252');
    expect(course.student.save).toHaveBeenCalled();
  });

  it('navigates to dashboard when clicked', () => {
    const context = EnzymeContext.build();
    const form = mount(<ChangeStudentId />, context);
    form.find('.btn.cancel').simulate('click');
    expect(Router.makePathname).toHaveBeenCalledWith('dashboard', params);
    expect(context.context.router.transitionTo).to.have.been.calledWith('go-to-dash');
  });

});
