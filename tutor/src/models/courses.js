import {
  BaseModel, identifiedBy, field, identifier, hasMany,
} from './base';
import { observable, computed } from 'mobx';
import { find } from 'lodash';
import { CourseListingActions } from '../flux/course-listing';
import Period  from './course/period';
import Role    from './course/role';
import Student from './course/student';

@identifiedBy('course')
class Course extends BaseModel {

  @identifier id

  @field appearance_code;
  @field name

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
  @field is_trial;
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

  @computed get isStudent() {
    return !!find(this.roles, 'isStudent');
  }

  @computed get isTeacher() {
    return !!find(this.roles, 'isTeacher');
  }

}

const courses = Object.assign(observable.shallowMap(), {
  // api.coffee calls this
  bootstrap( courseData ) {
    CourseListingActions.loaded(courseData);
    courseData.forEach(cd => courses.set(String(cd.id), new Course(cd)));
  },
});

export default courses;
