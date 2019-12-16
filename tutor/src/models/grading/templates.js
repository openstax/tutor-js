import Map from 'shared/model/map';
import {
  BaseModel, identifiedBy, action, field, identifier, computed,
} from 'shared/model';
import { autobind } from 'core-decorators';

@identifiedBy('grading/template')
class GradingTemplate extends BaseModel {

  // returns a formik errors object as described:
  // https://jaredpalmer.com/formik/docs/guides/validation
  static validate(tmpl) {
    const errors = {};
    if (tmpl.isReading) {
      if (tmpl.completion_weight + tmpl.correctness_weight != 100) {
        errors.common = 'Weights must add to 100%';
      }
    }
    return errors;
  }

  @identifier id;
  @field type;
  @field name;

  @field task_plan_type;
  @field completion_weight = 90;
  @field correctness_weight = 10;
  @field auto_grading_feedback_on;
  @field manual_grading_feedback_on;
  @field late_work_immediate_penalty;
  @field late_work_per_day_penalty;
  @field default_open_time;
  @field default_due_time;
  @field default_due_date_offset_days;
  @field default_close_date_offset_days;

  constructor(attrs, map) {
    super(attrs);
    this.map = map;
  }

  @computed get isReading() {
    return 'reading' === this.type;
  }

  // called from api
  save() {

  }

  onSaved() {

  }
}


class GradingTemplates extends Map {

  static Model = GradingTemplate;

  // called by API
  fetch() {
    // TODO remove once api is setup
    this.onLoaded({
      data: [
        { id: 1, name: 'Reading',  type: 'reading' },
        { id: 2, name: 'Homework', type: 'homework' },
      ],
    });
  }

  @action onLoaded({ data }) {
    this.mergeModelData(data);
  }

}

export { GradingTemplate, GradingTemplates };
