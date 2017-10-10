import { SnapShot } from './helpers/component-testing';

import Enroll from '../../src/components/enroll';

import EnzymeContext from './helpers/enzyme-context';
import Router from '../../src/helpers/router';
import EnrollModel from '../../src/models/course/enroll';
jest.mock('../../src/helpers/router');

describe('Student Enrollment', () => {
  let params, context, enrollment;

  beforeEach(() => {
    params = { courseId: '1' };
    context = EnzymeContext.build();
    enrollment = new EnrollModel({ enrollment_code: '1234', router: context.context.router });
    enrollment.create = jest.fn();
    Router.currentParams.mockReturnValue(params);
    Router.makePathname = jest.fn((name) => name);
  });

  it('loads when mounted', () => {
    enrollment.isLoadingCourses = true;
    const enroll = mount(<Enroll enrollment={enrollment} />);
    expect(enrollment.create).toHaveBeenCalled();
    expect(enroll).toHaveRendered('OXFancyLoader');
    expect(SnapShot.create(<Enroll enrollment={enrollment} />).toJSON()).toMatchSnapshot();
  });


  it('blocks teacher enrollment', () => {
    enrollment.api.errors = { is_teacher: { data: { course_name: 'My Fairly Graded Course' } } };
    expect(SnapShot.create(<Enroll enrollment={enrollment} />).toJSON()).toMatchSnapshot();
    const enroll = mount(<Enroll enrollment={enrollment} />);

    Router.makePathname = jest.fn(() => '/courses');
    enroll.find('Button').simulate('click');
    expect(Router.makePathname).toHaveBeenCalledWith('myCourses');
    expect(enrollment.router.history.push).toHaveBeenCalledWith('/courses');
  });


  it('displays an invalid message', () => {
    enrollment.api.errors = { invalid_enrollment_code: true };
    expect(SnapShot.create(<Enroll enrollment={enrollment} />).toJSON()).toMatchSnapshot();
  });

  describe('select periods', () => {
    beforeEach(() => {
      enrollment.enrollment_code = enrollment.originalEnrollmentCode = 'cc3c6ff9-83d8-4375-94be-8c7ae3024938';

      enrollment.onEnrollmentCreate({ data: { name: 'My Grand Course', periods: [
        { name: 'Period #1', enrollment_code: '1234' }, { name: 'Period #2', enrollment_code: '4321' },
      ] } });
    });

    it('matches snapshot', () => {
      expect(SnapShot.create(<Enroll enrollment={enrollment} />).toJSON()).toMatchSnapshot();
    });

    it('can display a list of periods when joining from enrollment launch uuid', () => {
      enrollment.onSubmitPeriod = jest.fn();
      const enroll = mount(<Enroll enrollment={enrollment} />);
      expect(enroll).toHaveRendered('SelectPeriod');
      enroll.find('.choice').last().simulate('click');
      enroll.find('.btn-primary').simulate('click');
      expect(enrollment.pendingEnrollmentCode).toEqual('4321');
      expect(enrollment.onSubmitPeriod).toHaveBeenCalled();
    });
  });

  it('submits with student id when form is clicked', () => {
    const enroll = mount(<Enroll enrollment={enrollment}  />, context);
    expect(enroll).toHaveRendered('StudentIDForm');
    expect(SnapShot.create(<Enroll enrollment={enrollment} />).toJSON()).toMatchSnapshot();
    enroll.find('input').simulate('change', { target: { value: '411' } });
    expect(enrollment.student_identifier).toEqual('411');
    enrollment.confirm = jest.fn();
    enroll.find('.btn-primary').simulate('click');
    expect(enrollment.confirm).toHaveBeenCalled();
  });

  it('redirects on success', () => {
    enrollment.to = { course: { id: '133' } };
    enrollment.isComplete = true;
    const enroll = mount(<Enroll enrollment={enrollment}  />, context);
    expect(enroll).toHaveRendered('Redirect');
  });

});
