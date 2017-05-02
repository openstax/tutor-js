import {
  BaseModel, identifiedBy, field, belongsTo, computed,
} from '../base';

import { extend, omit } from 'lodash';
import Offerings from './offerings';
import Courses from '../courses-map';
import Term from '../offerings/term';

@identifiedBy('course/create')
export default class CourseCreate extends BaseModel {

  @field name = '';
  @field offering_id = '';
  @field num_sections = 1;
  @field num_students;
  @field is_preview = false;
  @field is_college = false;
  @field time_zone = 'Central Time (US & Canada)';
  @field new_or_copy = 'new';
  @field cloned_from_id = false;
  @field copy_question_library = true;

  @belongsTo({ model: Term }) term;

  @computed get offering() {
    return Offerings.get(this.offering_id);
  }

  set offering(offering) {
    this.offering_id = offering.id;
    this.name = offering.title;
  }

  @computed get cloned_from() {
    return this.cloned_from_id ? Courses.get(this.cloned_from_id) : null;
  }

  set cloned_from(course) {
    this.cloned_from_id = course.id;
    this.name = course.name;
    this.is_college = course.is_college;
    this.num_sections = course.periods.length;
  }

  save() {
    const data = extend(omit(this.serialize(), 'term'), {
      term: this.term.term,
      year: this.term.year,
    });
    return {
      data,
      url: this.new_or_copy === 'new' ? '/courses' : `/courses/${this.cloned_from_id}/clone`,
    };
  }

  onCreated() {
    debugger
  }

}
