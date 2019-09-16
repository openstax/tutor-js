import { R, Factory, TutorRouter } from '../helpers';
import Enroll from '../../src/components/enroll';
import EnrollModel from '../../src/models/course/enroll';

jest.mock('../../src/helpers/router');
jest.mock('../../src/models/user', () => ({
  terms: { fetch: jest.fn() },
}));

describe('Student Enrollment', () => {
  let params;
  let enrollment;
  let coursesMap;
  let fetchMock;
  let course;

  beforeEach(() => {
    coursesMap = Factory.coursesMap();
    fetchMock = Promise.resolve();
    coursesMap.fetch = jest.fn(() => fetchMock);
    course = coursesMap.array[0];
    coursesMap.set(course.id, course);
    params = { courseId: course.id };

    enrollment = new EnrollModel({
      history: { push: jest.fn() },
      courses: coursesMap, enrollment_code: '1234',
    });
    enrollment.create = jest.fn();
    TutorRouter.currentParams.mockReturnValue(params);
    TutorRouter.makePathname = jest.fn((name) => name);
  });

  it('loads when mounted', async () => {
    enrollment.isLoadingCourses = true;
    const wrapper = mount(<R><Enroll enrollment={enrollment} /></R>);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(enrollment.create).toHaveBeenCalled();
    expect(wrapper).toHaveRendered('StaxlyAnimation');
    expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
  });


  it('blocks teacher enrollment', () => {
    enrollment.api.errors = { is_teacher: { data: { course_name: 'My Fairly Graded Course' } } };
    expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
    const enroll = mount(<R><Enroll enrollment={enrollment} /></R>);

    TutorRouter.makePathname = jest.fn(() => '/courses');
    enroll.find('Button').simulate('click');
    expect(TutorRouter.makePathname).toHaveBeenCalledWith('myCourses');
    expect(enrollment.history.push).toHaveBeenCalledWith('/courses');
  });

  it('forwards to your course if already a member', (done) => {
    enrollment.api.errors = { already_enrolled: { data: { course_name: 'My Course' } } };
    const enroll = mount(<R><Enroll enrollment={enrollment} /></R>);
    expect(enroll).toHaveRendered('StaxlyAnimation');
    enrollment.isComplete = true;
    enroll.update();
    setTimeout(() => {
      expect(enroll).toHaveRendered('Redirect');
      enroll.unmount();
      done();
    }, 100);
  });

  it('displays an invalid message', () => {
    enrollment.api.errors = { invalid_enrollment_code: true };
    expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
  });

  it('displays generic error message', () => {
    enrollment.api.errors = [{ code: 'blah', message: 'this is a error that we cant handle' }];
    expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
  });

  describe('select periods', () => {
    beforeEach(() => {
      enrollment.enrollment_code = enrollment.originalEnrollmentCode = 'cc3c6ff9-83d8-4375-94be-8c7ae3024938';

      enrollment.onEnrollmentCreate({
        data: {
          name: 'My Grand Course',

          periods: [
            { name: 'Period #1', enrollment_code: '1234' },
            {
              name: 'Period #2',
              enrollment_code: '4321',
            },
          ],
        },
      });
    });

    it('matches snapshot', () => {
      expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
    });

    it('can display a list of periods when joining from enrollment launch uuid', () => {
      const enroll = mount(<R><Enroll enrollment={enrollment} /></R>);
      expect(enroll).toHaveRendered('SelectPeriod');
      enroll.find('.choice').last().simulate('click');
      enroll.find('.btn-primary').simulate('click');
      expect(enrollment.pendingEnrollmentCode).toEqual('4321');

    });

    it('skips period selection when course has only one', () => {
      enrollment.create = jest.fn();
      enrollment.onEnrollmentCreate({
        data: {
          name: 'My Grand Course', periods: [{
            name: 'single period', enrollment_code: '4321',
          }],
        },
      });
      const enroll = mount(<R><Enroll enrollment={enrollment} /></R>);
      expect(enroll).toHaveRendered('StudentIDForm');
    });
  });

  it('submits with student id when form is clicked', () => {
    const enroll = mount(<R><Enroll enrollment={enrollment}  /></R>);
    expect(enroll).toHaveRendered('StudentIDForm');
    expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
    enroll.find('input').simulate('change', { target: { value: '411' } });
    expect(enrollment.student_identifier).toEqual('411');
    enrollment.confirm = jest.fn();
    enroll.find('.btn-primary').simulate('click');
    expect(enrollment.confirm).toHaveBeenCalled();
  });

  it('redirects on success', () => {
    enrollment.to = { course: { id: '133' } };
    enrollment.isComplete = true;
    const enroll = mount(<R><Enroll enrollment={enrollment}  /></R>);
    expect(enroll).toHaveRendered('Redirect');
  });

});
