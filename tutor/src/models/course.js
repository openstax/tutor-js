import {
  BaseModel, identifiedBy, field, identifier, hasMany,
} from './base';
import { observable, computed, action } from 'mobx';
import { find, get } from 'lodash';
import Period  from './course/period';
import Role    from './course/role';
import Student from './course/student';
import CourseInformation from '../flux/course-information';
import TimeHelper from '../helpers/time';
import { TimeStore } from '../flux/time';

@identifiedBy('course')
export default class Course extends BaseModel {

  @identifier id

  @field appearance_code;
  @field name;

  @field book_pdf_url;
  @field cloned_from_id;
  @field default_due_time;
  @field default_open_time;
  @field ecosystem_book_uuid;
  @field ecosystem_id;
  @field ends_at;
  @field is_active;
  @field is_college;
  @field is_concept_coach;
  @field is_preview;
  @field num_sections;
  @field offering_id;

  @field salesforce_book_name;
  @field starts_at;

  @field term;
  @field time_zone;
  @field webview_url;
  @field year;

  @hasMany({ model: Period }) periods;
  @hasMany({ model: Role }) roles;
  @hasMany({ model: Student }) students;

  @computed get subject() {
    return get(CourseInformation.forAppearanceCode(this.appearance_code), 'subject', '');
  }

  @computed get dataProps() {
    return {
      'data-title': this.name,
      'data-book-title': this.bookName,
      'data-appearance': this.appearanceCode,
    };
  }

  @computed get bounds() {
    return {
      start: TimeHelper.getMomentPreserveDate(this.starts_at, TimeHelper.ISO_DATE_FORMAT),
      end: TimeHelper.getMomentPreserveDate(this.ends_at, TimeHelper.ISO_DATE_FORMAT),
    };
  }

  @computed get hasEnded() {
    return moment(this.ends_at).isBefore(TimeStore.getNow());
  }

  @computed get isFuture() {
    return moment(course.starts_at).isAfter(TimeStore.getNow())
  }

  @computed get isActive() {
    return !(this.hasEnded || this.isFuture);
  }

  @computed get isStudent() {
    return !!find(this.roles, 'isStudent');
  }

  @computed get isTeacher() {
    return !!find(this.roles, 'isTeacher');
  }

  @computed get tourAudienceTags() {
    const tags = [];
    if (this.isTeacher) {
      tags.push(this.is_preview ? 'teacher-preview' : 'teacher');
    }
    if (this.isStudent) { tags.push('student'); }
    return tags;
  }

}
