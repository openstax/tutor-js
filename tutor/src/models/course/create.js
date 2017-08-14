import {
  BaseModel, identifiedBy, field, belongsTo, computed, session,
} from '../base';
import { observable, action } from 'mobx';
import { readonly } from 'core-decorators';
import { extend, omit, inRange } from 'lodash';
import Offerings from './offerings';
import Courses from '../courses-map';
import Term from './offerings/term';
import S from '../../helpers/string';


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

  @observable errors = observable.map();

  @readonly validations = {
    num_sections: {
      name: 'sections',
      range: [ 1, 10 ],
    },
    estimated_student_count: {
      name: 'student count',
      range: [ 1, 1500 ],
    },
  }

  @action setValue(attr, count) {
    const range = this.validations[attr].range;
    if (range && inRange(count, range[0], range[1]+1)) {
      this[attr] = count;
      this.errors.delete(attr);
    } else {
      this.errors.set(
        attr,
        `${this.validations[attr].name} must be between ${range[0]}-${range[1]}`,
      );
    }
  }

  @computed get hasError() {
    return Boolean(this.errors.size);
  }

  @computed get errorMessage() {
    const msgs = this.errors.values();
    if (msgs.length) {
      return S.capitalize(S.toSentence(msgs));
    }
    return '';
  }

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
