import { Testing, sinon, _, ReactTestUtils } from 'shared/specs/helpers';

import React from 'react';

import ConfirmJoinCourse from '../../../src/components/enroll/confirm-join-course';

const COURSE_ENROLLMENT_STORE_WITH_CONFLICT = {
  isBusy: false,
  hasConflict() { return true; },
  description() { return 'New CC course'; },
  teacherNames() { return 'New course instructors'; },
  conflictDescription() { return 'Previous CC course'; },
  conflictTeacherNames() { return 'Previous course instructors'; },
  getEnrollmentChangeId() { return 42; },
  getStudentIdentifier() { return 'S000042'; },
  errorMessages() { return []; },
};

const COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT = {
  isBusy: false,
  hasConflict() { return false; },
  description() { return 'New Tutor course'; },
  teacherNames() { return 'New course instructors'; },
  getEnrollmentChangeId() { return 42; },
  getStudentIdentifier() { return 'S000042'; },
  errorMessages() { return []; },
};

describe('ConfirmJoinCourse Component', function() {
  let courseEnrollmentActions = null;

  beforeEach(() => courseEnrollmentActions = { confirm: sinon.spy() });

  describe('with conflict', function() {

    it('displays info about the conflicting CC course', function() {
      const wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT} />);
      expect(wrapper.find('.conflicts li').text()).to.eq(
        'We will remove you from Previous CC course with Previous course instructors. If you want to stay enrolled in the OpenStax Concept Coach for that course, contact us.'
      );
      return undefined;
    });

    it('displays info about the CC course being joined', function() {
      const wrapper = shallow(<ConfirmJoinCourse
        courseEnrollmentActions={courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT} />);
      expect(wrapper.find('.title .join').text()).to.eq('You are joining');
      expect(wrapper.find('.title .course').text()).to.eq('New CC course');
      expect(wrapper.find('.title .teacher').text()).to.eq('New course instructors');
      return undefined;
    });

    it('calls confirm() on the courseEnrollmentActions object when the button is clicked', function() {
      const wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT} />);
      wrapper.find('.btn.continue').simulate('click');
      expect(courseEnrollmentActions.confirm.calledOnce).to.be.true;
      return undefined;
    });

    return xit('calls confirm() on the courseEnrollmentActions object when enter is pressed', function() {
      const wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT} />);

      // These do not work... Enzyme bug? https://github.com/airbnb/enzyme/issues/441
      // http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
      wrapper.simulate('keyPress', { key: 'Enter' });
      wrapper.find('.btn.continue').simulate('keyPress', { key: 'Enter' });
      expect(courseEnrollmentActions.confirm.called).to.be.true;
      return undefined;
    });
  });

  return describe('without conflict', function() {

    it('does not display conflicting CC course info', function() {
      const wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT} />);
      expect(wrapper.find('.conflicts li').length).toEqual(0);
      return undefined;
    });

    it('displays info about the course being joined', function() {
      const wrapper = shallow(<ConfirmJoinCourse
        courseEnrollmentActions={courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT} />);
      expect(wrapper.find('.title .join').text()).to.eq('You are joining');
      expect(wrapper.find('.title .course').text()).to.eq('New Tutor course');
      expect(wrapper.find('.title .teacher').text()).to.eq('New course instructors');
      return undefined;
    });

    it('calls confirm() on the courseEnrollmentActions object when the button is clicked', function() {
      const wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT} />);
      wrapper.find('.btn.continue').simulate('click');
      expect(courseEnrollmentActions.confirm.calledOnce).to.be.true;
      return undefined;
    });

    return xit('calls confirm() on the courseEnrollmentActions object when enter is pressed', function() {
      const wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT} />);

      // These do not work... Enzyme bug? https://github.com/airbnb/enzyme/issues/441
      // http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
      wrapper.simulate('keyPress', { key: 'Enter' });
      wrapper.find('.btn.continue').simulate('keyPress', { key: 'Enter' });
      expect(courseEnrollmentActions.confirm.called).to.be.true;
      return undefined;
    });
  });
});
