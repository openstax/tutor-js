import { TutorRouter, EnzymeContext } from '../helpers';
import ChangeStudentId from '../../src/components/change-student-id';
import { bootstrapCoursesList } from '../courses-test-data';

jest.mock('../../src/helpers/router');

describe('Change Student ID', () => {
  let params, courses, context;

  beforeEach(() => {
    context = EnzymeContext.build();
    params = { courseId: '1' };
    courses = bootstrapCoursesList();
    TutorRouter.currentParams.mockReturnValue(params);
    TutorRouter.makePathname.mockReturnValue('go-to-dash');
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
    wrapper.find('input').at(0).getDOMNode().value = 'MY-NEW-ID';

    wrapper.find('.btn-primary').simulate('click');
    expect(course.userStudentRecord.student_identifier).toEqual('MY-NEW-ID');
    expect(course.userStudentRecord.saveOwnStudentId).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('navigates to dashboard when clicked', () => {
    const form = mount(<ChangeStudentId />, context);
    form.find('.btn.cancel').simulate('click');
    expect(TutorRouter.makePathname).toHaveBeenCalledWith('dashboard', params);
    expect(context.context.router.history.push).toHaveBeenCalledWith('go-to-dash');
  });

  it('warns when invalid', () => {
    const form = mount(<ChangeStudentId />, context);
    form.find('input').simulate('keyUp', { target: { value: '' } });
    expect(form).toHaveRendered('.invalid-warning');
  });
});
