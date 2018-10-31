import { Testing, expect, sinon, _, ReactTestUtils } from 'shared/specs/helpers';

import React from 'react';

import CcJoinConflict from '../../../src/components/enroll/cc-join-conflict';

const COURSE_ENROLLMENT_STORE = {
  isBusy: false,
  description() { return 'New CC course'; },
  teacherNames() { return 'New course instructors'; },
  conflictDescription() { return 'Previous CC course'; },
  conflictTeacherNames() { return 'Previous course instructors'; },
};

describe('CcJoinConflict Component', function() {
  let courseEnrollmentActions = null;

  beforeEach(() => courseEnrollmentActions = { conflictContinue: sinon.spy() });

  it('displays info about the conflicting CC course', function() {
    const wrapper = mount(<CcJoinConflict
      courseEnrollmentActions={courseEnrollmentActions}
      courseEnrollmentStore={COURSE_ENROLLMENT_STORE} />);
    expect(wrapper.find('.conflict li').text()).to.eq(
      'You are already enrolled in another OpenStax Concept Coach using this textbook, Previous CC course with Previous course instructors. To make sure you don\'t lose work, we strongly recommend enrolling in only one Concept Coach per textbook. When you join the new course below, we will remove you from the other course.'
    );
    return undefined;
  });

  it('displays info about the course being joined', function() {
    const wrapper = shallow(<CcJoinConflict
      courseEnrollmentActions={courseEnrollmentActions}
      courseEnrollmentStore={COURSE_ENROLLMENT_STORE} />);
    expect(wrapper.find('.title .join').text()).to.eq('You are joining');
    expect(wrapper.find('.title .course').text()).to.eq('New CC course');
    expect(wrapper.find('.title .teacher').text()).to.eq('New course instructors');
    return undefined;
  });

  it('calls conflictContinue() on the courseEnrollmentActions object when the button is clicked', function() {
    const wrapper = shallow(<CcJoinConflict
      courseEnrollmentActions={courseEnrollmentActions}
      courseEnrollmentStore={COURSE_ENROLLMENT_STORE} />);
    wrapper.find('.btn.continue').simulate('click');
    expect(courseEnrollmentActions.conflictContinue.calledOnce).toBe(true);
    return undefined;
  });

  return xit('calls conflictContinue() on the courseEnrollmentActions object when enter is pressed', function() {
    const wrapper = mount(<CcJoinConflict
      courseEnrollmentActions={courseEnrollmentActions}
      courseEnrollmentStore={COURSE_ENROLLMENT_STORE} />);

    // These do not work... Enzyme bug? https://github.com/airbnb/enzyme/issues/441
    // http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
    wrapper.simulate('keyPress', { key: 'Enter' });
    wrapper.find('.btn.continue').simulate('keyPress', { key: 'Enter' });
    expect(courseEnrollmentActions.conflictContinue.called).toBe(true);
    return undefined;
  });
});
