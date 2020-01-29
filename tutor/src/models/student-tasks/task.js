import {
  BaseModel, identifiedBy, field, identifier, hasMany, session, computed, observable,
} from 'shared/model';
import { defaults, countBy } from 'lodash';
import moment from 'moment';
import Time from '../time';
import StudentTaskStep from './step';
import Student from './student';
import { AppActions } from '../../flux/app';
export { StudentTaskStep };

export default
@identifiedBy('student-tasks/task')
class StudentTask extends BaseModel {

  @identifier id;
  @field title;
  @field description;
  @field type;
  @field complete;
  @field is_deleted;
  @field({ type: 'object' }) spy;
  @hasMany({ model: Student }) students;
  @field({ type: 'date' }) due_at;
  @field({ type: 'date' }) feedback_at;
  @hasMany({ model: StudentTaskStep, inverseOf: 'task' }) steps;

  @session({ type: 'object' }) tasksMap;

  @computed get isReading() { return 'reading' === this.type; }
  @computed get isHomework() { return 'homework' === this.type; }
  @computed get isPractice() { return this.type && this.type.includes('practice'); }
  @observable isLoading = false

  @computed get isFeedbackAvailable() {
    return Boolean(
      !this.isHomework || !this.feedback_at || moment(this.feedback_at).isBefore(Time.now)
    );
  }

  @computed get progress() {
    return defaults(
      countBy(this.steps, s => s.is_completed ? 'complete' : 'incomplete'), {
        complete: 0,
        incomplete: 0,
      }
    );
  }

  // if the task's first step is a placeholder, we want to keep fetching it until it isn't
  @computed get isLoaded() {
    return Boolean(this.api.hasBeenFetched && (!this.steps || !this.steps[0].isPlaceHolder));
  }

  // attempt to load the task until isLoaded returns true or we exceed 30 attempts
  async load() {
    if (this.isLoading) return this;
    this.isLoading = true;
    try {
      let tries_remaining = 30;
      while(tries_remaining > 0) {
        await this.fetch();
        if (this.isLoaded) {
          break;
        }
        // wait 1 second in between load attempts
        await new Promise(resolve => setTimeout(resolve, 1000));
        tries_remaining--;
      }
      if (tries_remaining == 0) {
        // create a synthetic server error to display the "no exercises are available" modal
        AppActions.setServerError({ status: 504, data: { errors: [{ code: 'biglearn_not_ready' }] } });
      }
    } catch (err) {
      AppActions.setServerError({ status: 504, data: { errors: [err] } });
    }
    this.isLoading = false;
    return this;
  }

  // called by API
  fetch() { }
  onFetchComplete({ data }) {
    const { steps, ...task } = data;
    this.api.errors = {};
    this.update(task);
    steps.forEach((stepData, i) => {
      if (this.steps.length > i) {
        this.steps[i].setFromTaskFetch(stepData);
      } else {
        this.steps.push(stepData);
      }
    });
    if (steps.length < this.steps.length) {
      this.steps.splice(steps.length, this.steps.length - steps.length);
    }
    this.steps.forEach(s => s.task = this);
  }
}
