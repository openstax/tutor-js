import {
  BaseModel, identifiedBy, field, belongsTo, computed, session,
} from '../base';
import { observable } from 'mobx';
import { extend, omit } from 'lodash';
import Offerings from './offerings';
import Courses from '../courses-map';
import Term from './offerings/term';

@identifiedBy('course/create')
export default class CourseCreate extends BaseModel {

  @field name = '';
  @field offering_id = '';
  @field num_sections = 1;
  @field estimated_student_count;
  @field is_preview = false;
  @field time_zone = 'Central Time (US & Canada)';
  @session new_or_copy = 'new';
  @field cloned_from_id = false;
  @field copy_question_library = true;

  @observable createdCourse;

  @belongsTo({ model: Term }) term;

  @computed get offering() {
    return Offerings.get(this.offering_id);
  }

  set offering(offering) {
    this.offering_id = offering.id;
    if (!this.name) {
      this.name = offering.title;
    }
  }

  @computed get cloned_from() {
    return this.cloned_from_id ? Courses.get(this.cloned_from_id) : null;
  }

  set cloned_from(course) {
    this.cloned_from_id = course.id;
    this.name = course.name;
    this.num_sections = course.periods.length;
  }

  save() {
    const data = extend(omit(this.serialize(), 'term'), {
      term: this.term.term,
      year: this.term.year,
    });
    return {
      data,
      url: this.cloned_from_id ? `/courses/${this.cloned_from_id}/clone` : '/courses',
    };
  }

  onCreated({ data: courseData }) {
    this.createdCourse = Courses.addNew(courseData);
  }

}
