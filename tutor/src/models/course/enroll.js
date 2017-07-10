import {
  BaseModel, identifiedBy, field, identifier, computed, session,
} from '../base';
import { when } from 'mobx';
import { get, pick, isEmpty } from 'lodash';
import { CourseListingActions } from '../../flux/course-listing';

@identifiedBy('course/student')
export default class CourseEnrollment extends BaseModel {

  @identifier id;
  @field enrollment_code;

  @field student_identifier;

  @session({ type: 'object' }) to = {};
  @session status;

  constructor(...args) {
    super(...args);
    when(
      () => this.isComplete,
      () => CourseListingActions.load(),
    );
  }

  @computed get courseDescription() {
    return get(this, 'to.course.name', '');
  }

  @computed get isPending() {
    return Boolean(isEmpty(this.apiErrors) && isEmpty(this.to));
  }

  @computed get isInvalid() {
    return Boolean(this.apiErrors && this.apiErrors.invalid_enrollment_code);
  }

  @computed get isComplete() {
    return Boolean(get(this.apiErrors, 'already_enrolled') || this.status == 'processed');
  }

  // called by api
  create() {
    return { data: pick(this, 'enrollment_code') };
  }

  confirm() { }

}
