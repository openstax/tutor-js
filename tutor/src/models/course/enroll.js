import {
  BaseModel, identifiedBy, field, identifier, computed, session,
} from '../base';
import { when, observable } from 'mobx';
import { get, pick, isEmpty } from 'lodash';
import { CourseListingActions, CourseListingStore } from '../../flux/course-listing';

@identifiedBy('course/student')
export default class CourseEnrollment extends BaseModel {

  @identifier id;
  @field enrollment_code;

  @field student_identifier;

  @session({ type: 'object' }) to = {};
  @session status;

  @observable isComplete = false;

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

  fetchCourses() {
    CourseListingStore.once('loaded', () => this.isComplete = true);
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
