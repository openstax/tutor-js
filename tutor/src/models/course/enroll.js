import React from 'react';
import {
  BaseModel, identifiedBy, field, identifier, computed, session,
} from '../base';
import { action, when, observable } from 'mobx';
import { get, pick, isEmpty } from 'lodash';
import { Redirect } from 'react-router-dom';
import S from '../../helpers/string';
import Router from '../../../src/helpers/router';
import { CourseListingActions, CourseListingStore } from '../../flux/course-listing';
import StudentTasks from '../student-tasks';
import Activity from '../../../src/components/ox-fancy-loader';

import Enroll from '../../../src/components/enroll';
import Course from '../course';

@identifiedBy('course/student')
export default class CourseEnrollment extends BaseModel {

  @identifier id;
  @field enrollment_code;

  @field student_identifier;

  @session({ type: 'object' }) to = {};
  @session status;
  @session({ type: 'object' }) router;
  @observable isComplete = false;
  @observable courseToJoin;
  @observable isLoadingCourses;

  constructor(...args) {
    super(...args);
    when(
      () => this.isRegistered,
      () => this.fetchCourses(),
    );
  }

  @computed get bodyContents() {
    if (this.isLoading) {
      return <Activity isLoading={true} />;
    } else if (this.isFromLms && false === this.courseIsLmsEnabled) {
      return this.renderComponent('invalidLMS');
    } else if (!this.isFromLms && true === this.courseIsLmsEnabled) {
      return this.renderComponent('invalidLinks');
    } else if (this.isTeacher) {
      return this.renderComponent('invalidTeacher');
    } else if (this.isInvalid) {
      return this.renderComponent('invalidCode');
    } else if (this.courseToJoin) {
      return this.renderComponent('selectPeriod');
    } else if (this.isComplete) {
      if (this.courseId)
        return <Redirect to={Router.makePathname('dashboard', { courseId: this.courseId })} />;
      else
        return <Redirect to={Router.makePathname('myCourses')} />;
    } else {
      return this.renderComponent('studentIDForm');
    }
  }

  renderComponent(name) {
    const Tag = Enroll.Components[name];
    return <Tag enrollment={this} />;
  }

  @action.bound
  selectPeriod(period) {
    this.enrollment_code = period.enrollment_code;
  }

  @computed get courseIsLmsEnabled() {
    return this.courseToJoin ?
      this.courseToJoin.is_lms_enabled : get(this, 'to.course.is_lms_enabled', null);
  }

  @action.bound
  onCancel() {
    this.router.history.push(Router.makePathname('myCourses'));
  }

  @action.bound
  onCancelStudentId() {
    this.student_identifier = '';
    this.onConfirm();
  }

  @action.bound
  onSubmitPeriod() {
    this.courseToJoin = null;
    this.create();
  }

  @action.bound
  onStudentIdContinue() {
    this.confirm();
  }

  @computed get courseName() {
    if (this.isTeacher) {
      return get(this.apiErrors, 'is_teacher.data.course_name', '');
    }
    return get(this, 'to.course.name', '');
  }

  @computed get courseId() {
    return get(this, 'to.course.id', '');
  }

  @computed get isPending() {
    return Boolean(isEmpty(this.apiErrors) && isEmpty(this.to));
  }

  @computed get isInvalid() {
    return Boolean(this.apiErrors && this.apiErrors.invalid_enrollment_code);
  }

  @computed get isTeacher() {
    return Boolean(get(this.apiErrors, 'is_teacher'));
  }

  @computed get isRegistered() {
    return Boolean(get(this.apiErrors, 'already_enrolled') || this.status == 'processed');
  }

  @computed get isLoading() {
    return Boolean(this.hasApiRequestPending || this.isLoadingCourses);
  }

  @computed get needsPeriodSelection() {
    return this.isFromLms;
  }

  @computed get isFromLms() {
    return S.isUUID(this.enrollment_code);
  }

  fetchCourses() {
    this.isLoadingCourses = true;
    CourseListingStore.once('loaded', () => {
      const assignments_count = get(this, 'to.period.assignments_count', 0);
      if (assignments_count) {
        const tasks = StudentTasks.forCourseId(this.courseId);
        tasks.pollForUpdates({ expectedCount: assignments_count });
      }
      this.isLoadingCourses = false;
      this.isComplete = true;
    });
    CourseListingActions.load();
  }


  // called by api
  create() {
    if (this.needsPeriodSelection) {
      return { method: 'GET', url: `enrollment/${this.enrollment_code }/choices` };
    }
    return { data: pick(this, 'enrollment_code') };
  }

  onEnrollmentCreate({ data }) {
    if(this.needsPeriodSelection) {
      this.courseToJoin = new Course(data);
    } else {
      this.update(data);
    }
  }

  confirm() {
    return { data: pick(this, 'student_identifier') };
  }

}
