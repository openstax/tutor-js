import Map from 'shared/model/map';
import {
  BaseModel, identifiedBy, action, field, identifier, computed,
} from 'shared/model';
import { set } from 'lodash';

@identifiedBy('grading/template')
class GradingTemplate extends BaseModel {

  // returns a formik errors object as described:
  // https://jaredpalmer.com/formik/docs/guides/validation
  static validate(tmpl) {
    const errors = {};
    if (tmpl.isReading) {
      if (tmpl.completion_weight + tmpl.correctness_weight != 100) {
        set(errors, 'common.weights', 'Weights must add to 100%');
      }
    }
    return errors;
  }

  @identifier id;
  @field name = '';
  @field task_plan_type;
  @field completion_weight = 90;
  @field correctness_weight = 10;
  @field auto_grading_feedback_on = 'answer';
  @field manual_grading_feedback_on = 'grade';
  @field late_work_immediate_penalty = false;
  @field late_work_per_day_penalty = true;
  @field default_open_time = '00:01';
  @field default_due_time = '07:00';
  @field default_due_date_offset_days = 1;
  @field default_close_date_offset_days = 1;

  constructor(attrs, map) {
    super(attrs);
    this.map = map;
    ['completion_weight', 'correctness_weight'].forEach(k => {
      if (this[k] < 1) { this[k] = this[k] * 100; }
    });
  }

  @computed get isReading() {
    return 'reading' === this.task_plan_type;
  }

  @computed get isHomework() {
    return 'homework' === this.task_plan_type;
  }

  // called from api
  save() {
    return {
      id: this.id,
      courseId: this.map.course.id,
      data: {
        ...this.serialize(),
        completion_weight: this.completion_weight / 100,
        correctness_weight: this.correctness_weight / 100,
      },
    };
  }

  onSaved() {

  }

  remove() {

  }

  onRemoved() {
    this.map.delete(this.id);
  }
}


class GradingTemplates extends Map {

  static Model = GradingTemplate;

  constructor({ course }) {
    super();
    this.course = course;
  }

  newTemplate(attrs) {
    return new GradingTemplate(attrs, this);
  }

  // called by API
  fetch() {
    return { courseId: this.course.id };
  }

  @action onLoaded({ data }) {
    this.mergeModelData(data.items);
  }


}

export { GradingTemplate, GradingTemplates };
