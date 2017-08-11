import {
  BaseModel, identifiedBy, field, identifier, computed, session,
} from '../base';
import { when, observable } from 'mobx';
import { get, pick, isEmpty } from 'lodash';
import { CourseListingActions, CourseListingStore } from '../../flux/course-listing';
import StudentTasks from '../student-tasks';
import Courses from '../courses-map';

@identifiedBy('course/student')
export default class CourseEnrollment extends BaseModel {

  @identifier id;
  @field enrollment_code;

  @field student_identifier;

  @session({ type: 'object' }) to = {};
  @session status;

  @observable isComplete = false;
  @observable isLoadingCourses;
  constructor(...args) {
    super(...args);
    when(
      () => this.isRegistered,
      () => this.fetchCourses(),
    );
  }

  @computed get courseDescription() {
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

  @computed get isRegistered() {
    return Boolean(get(this.apiErrors, 'already_enrolled') || this.status == 'processed');
  }

  @computed get isLoading() {
    return this.hasApiRequestPending || this.isLoadingCourses;
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
    return { data: pick(this, 'enrollment_code') };
  }

  confirm() {
    return { data: pick(this, 'student_identifier') };
  }

}
