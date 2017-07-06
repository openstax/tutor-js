import { Testing, expect, sinon, _, ReactTestUtils } from 'shared/specs/helpers';

import React from 'react';

import Enroll from 'components/enroll';
import { CourseEnrollmentActions, CourseEnrollmentStore } from 'flux/course-enrollment';
import ENROLLMENT_CHANGE_DATA from '../../../api/enrollment_changes/POST_WITH_CONFLICT';

import JoinConflict from 'components/enroll/join-conflict';
import ConfirmJoin from 'components/enroll/confirm-join';

describe('Enroll Component', function() {

  beforeEach(function() { return this.wrapper = mount(<Enroll />); });

  it('renders loading message if EnrollmentChange is loading', function() {
    expect(this.wrapper.find(JoinConflict)).to.be.empty;
    expect(this.wrapper.find(ConfirmJoin)).to.be.empty;
    expect(this.wrapper.text()).to.include('Loading');
    return (
        undefined
    );
  });

  it('renders join conflict page if EnrollmentChange is conflicting', function() {
    CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA);
    this.wrapper.node.forceUpdate();
    expect(this.wrapper.find(JoinConflict)).not.to.be.empty;
    expect(this.wrapper.find(ConfirmJoin)).to.be.empty;
    return (
        undefined
    );
  });

  it('renders confirmation if EnrollmentChange is pending', function() {
    CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA);
    CourseEnrollmentActions.conflictContinue();
    this.wrapper.node.forceUpdate();
    expect(this.wrapper.find(JoinConflict)).to.be.empty;
    expect(this.wrapper.find(ConfirmJoin)).not.to.be.empty;
    return (
        undefined
    );
  });

  return (

      it('renders done message if EnrollmentChange is approved', function() {
        CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA)

  );
    CourseEnrollmentActions.conflictContinue();
    CourseEnrollmentActions.confirmed(_.extend(ENROLLMENT_CHANGE_DATA, {status: "processed"}));
    this.wrapper.node.forceUpdate();
    expect(this.wrapper.find(JoinConflict)).to.be.empty;
    expect(this.wrapper.find(ConfirmJoin)).to.be.empty;
    expect(this.wrapper.text()).to.include(
      'You have successfully joined College Physics with Concept Coach II (section 2nd)');
    return (
        undefined
    );
  });
});
