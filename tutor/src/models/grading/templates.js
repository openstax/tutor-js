import Map from 'shared/model/map';
import {
  BaseModel, identifiedBy, action, field,
  identifier, computed, observable,
} from 'shared/model';


@identifiedBy('grading/template')
class GradingTemplate extends BaseModel {

  // returns a formik errors object as described:
  // https://jaredpalmer.com/formik/docs/guides/validation
  static validate(tmpl, form) { // eslint-disable-line no-unused-vars
    return {};
  }

  @identifier id;
  @field name = '';
  @field task_plan_type;
  @field completion_weight = 0.9;
  @field correctness_weight = 0.1;
  @field auto_grading_feedback_on = 'answer';
  @field manual_grading_feedback_on = 'publish';
  @field late_work_penalty = 0.1;
  @field late_work_penalty_applied = 'daily';
  @field default_open_time = '00:01';
  @field default_due_time = '21:00';
  @field default_due_date_offset_days = 7;
  @field default_close_date_offset_days = 7;
  @observable map;

  @observable map = {};

  constructor(attrs, map) {
    super(attrs);
    this.map = map;

    if (this.isNew && this.isReading) {
      this.late_work_penalty_applied = 'immediately';
    }
    if (this.isNew && this.isHomework) {
      this.manual_grading_feedback_on = 'grade';
    }
  }

  @computed get isReading() {
    return 'reading' === this.task_plan_type;
  }

  @computed get isHomework() {
    return 'homework' === this.task_plan_type;
  }

  @computed get isLateWorkAccepted() {
    return this.late_work_penalty_applied !== 'never';
  }

  @computed get canRemove() {
    // a template can be removed as if there is at least one other with the same type
    return Boolean(this.map && this.map.array.find(t => t !== this && t.task_plan_type === this.task_plan_type));
  }

  get dataForSave() {
    const data = this.serialize();
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
    if (!this.map.get(this.id)) {
      this.map.set(this.id, this);
    }
  }

  remove() {

  }

  onRemoved() {
    this.map.delete(this.id);
  }

  isDuplicateName(name) {
    return Boolean(this.map && this.map.array.find(t => t.name === name));
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
