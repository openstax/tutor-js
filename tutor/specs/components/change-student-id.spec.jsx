import { SnapShot } from './helpers';

import ChangeStudentId from '../../src/components/change-student-id';
import { bootstrapCoursesList } from '../courses-test-data';
import EnzymeContext from './helpers/enzyme-context';
import Router from '../../src/helpers/router';
jest.mock('../../src/helpers/router');

describe('Change Student ID', () => {
  let params, courses, context;

  beforeEach(() => {
    context = EnzymeContext.build();
    params = { courseId: '1' };
    courses = bootstrapCoursesList();
    Router.currentParams.mockReturnValue(params);
    Router.makePathname.mockReturnValue('go-to-dash');
  });

  it('renders and matches snapshot for various states', () => {
    expect.snapshot(<ChangeStudentId />).toMatchSnapshot();
  });

  it('is accessible', async () => {
    const wrapper = mount(<ChangeStudentId />, context);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.unmount();
  });

  it('updates student id when edited', async () => {
    const course = courses.get(params.courseId);
    course.userStudentRecord.saveOwnStudentId = jest.fn(() => Promise.resolve({}));
    const wrapper = mount(<ChangeStudentId />, context);
    wrapper.find('input').get(0).value = '4252';
    wrapper.find('.btn-primary').simulate('click');
    expect(course.userStudentRecord.student_identifier).toEqual('4252');
    expect(course.userStudentRecord.saveOwnStudentId).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('navigates to dashboard when clicked', () => {
    const form = mount(<ChangeStudentId />, context);
    form.find('.btn.cancel').simulate('click');
    expect(Router.makePathname).toHaveBeenCalledWith('dashboard', params);
    expect(context.context.router.history.push).toHaveBeenCalledWith('go-to-dash');
  });

  it('warns when invalid', () => {
    const form = mount(<ChangeStudentId />, context);
    form.find('input').simulate('keyUp', { target: { value: '' } });
    expect(form).toHaveRendered('.invalid-warning');
  });
});
