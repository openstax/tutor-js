import {
  BaseModel, identifiedBy, field, belongsTo, computed, session,
} from 'shared/model';
import { observable, action } from 'mobx';
import { readonly } from 'core-decorators';
import { extend, omit, inRange } from 'lodash';
import Offerings from './offerings';
import Courses from '../courses-map';
import Term from './offerings/term';

export default
@identifiedBy('course/create')
class CourseCreate extends BaseModel {

  @field name = '';
  @field offering_id = '';
  @field num_sections = 1;
  @field estimated_student_count;
  @field is_preview = false;
  @field time_zone = 'Central Time (US & Canada)';
  @session new_or_copy = 'new';
  @session cloned_from_id = false;
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
      name: 'students',
      range: [ 1, 1500 ],
    },
  }

  constructor({ courses = Courses, offerings = Offerings, ...attrs } = {}) {
    super(attrs);
    this.courses = courses;
    this.offerings = offerings;
  }

  @action setValue(attr, count) {
    const range = this.validations[attr].range;
    if (range && inRange(count, range[0], range[1]+1)) {
      this[attr] = count;
      this.errors.delete(attr);
    } else {
      this.errors.set(attr, {
        direction: count < range[0] ? 'less' : 'more',
        attribute: this.validations[attr].name,
        value: count < range[0] ? range[0] : range[1],
      });
    }
  }

  @computed get error() {
    return this.errors.size ? Array.from(this.errors.values())[0] : null;
  }

  @computed get offering() {
    return this.offerings.get(this.offering_id);
  }

  set offering(offering) {
    this.offering_id = offering.id;
    this.name = offering.title;
  }

  @computed get cloned_from() {
    return this.cloned_from_id ? this.courses.get(this.cloned_from_id) : null;
  }

  set cloned_from(course) {
    this.cloned_from_id = course.id;
    if (this.canCloneCourse) {
      this.name = course.name;
      this.num_sections = course.periods.length;
    }
  }

  get cloned_from_offering() {
    return this.cloned_from && this.offerings.get(this.cloned_from.offering_id);
  }

  @computed get canCloneCourse() {
    return Boolean(
      this.cloned_from_offering && this.cloned_from_offering.is_available
    );
  }

  save() {
    const data = extend(omit(this.serialize(), 'term'), {
      term: this.term.term,
      year: this.term.year,
    });
    if (this.canCloneCourse) {
      data.cloned_from_id = this.cloned_from_id;
    }
    return {
      data,
      url: this.canCloneCourse ? `/courses/${this.cloned_from_id}/clone` : '/courses',
    };
  }

  onCreated({ data: courseData }) {
    this.createdCourse = this.courses.addNew(courseData);
  }

}
