import Map from 'shared/model/map';
import {
  BaseModel, identifiedBy, action, field, identifier, computed,
} from 'shared/model';
import { set } from 'lodash';

const DECIMAL_CONVERSION_FIELDS = [
  'late_work_immediate_penalty',
  'late_work_per_day_penalty',
  'completion_weight',
  'correctness_weight',
];

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
  @field late_work_immediate_penalty = 10;
  @field late_work_per_day_penalty = 10;
  @field default_open_time = '00:01';
  @field default_due_time = '07:00';
  @field default_due_date_offset_days = 1;
  @field default_close_date_offset_days = 1;

  constructor(attrs, map) {
    super(attrs);
    this.map = map;
    this.decimalsToWhole();
  }

  @action decimalsToWhole() {
    DECIMAL_CONVERSION_FIELDS.forEach(
      f => (this[f] < 1) && (this[f] = this[f] * 100),
    );
  }

  @computed get isReading() {
    return 'reading' === this.task_plan_type;
  }

  @computed get isHomework() {
    return 'homework' === this.task_plan_type;
  }

  @computed get isLateWorkAccepted() {
    return this.late_work_immediate_penalty < 100;
  }

  get dataForSave() {
    const data = this.serialize();
    DECIMAL_CONVERSION_FIELDS.forEach(
      f => (data[f] = data[f] / 100).toFixed(2)
    );
    return data;
  }

  // called from api
  save() {
    return {
      id: this.id,
      courseId: this.map.course.id,
      data: this.dataForSave,
    };
  }

  @action onSaved({ data }) {
    this.update(data);
    this.decimalsToWhole();
    if (!this.map.get(this.id)) {
      this.map.set(this.id, this);
    }
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
