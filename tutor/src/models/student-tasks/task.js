import {
  BaseModel, identifiedBy, field, identifier, hasMany, session, computed, observable,
} from 'shared/model';
import { defaults, countBy, isEmpty, sumBy } from 'lodash';
import moment from 'moment';
import Time from '../time';
import StudentTaskStep from './step';
import Student from './student';
import { AppActions } from '../../flux/app';
export { StudentTaskStep };
import S from '../../helpers/string';

export default
@identifiedBy('student-tasks/task')
class StudentTask extends BaseModel {

  @identifier id;
  @field title;
  @field description;
  @field type;
  @field complete;
  @field is_deleted;
  @field completion_weight;
  @field correctness_weight;
  @field late_work_penalty_applied;
  @field late_work_penalty_per_period;
  @field published_late_work_point_penalty; // point penalty that is visible to the student
  @field published_points; // points that are visible to the student
  @field({ type: 'object' }) spy;
  @field({ type: 'date' }) due_at;
  @field({ type: 'date' }) closes_at;
  @field({ type: 'date' }) feedback_at;
  @field is_provisional_score;

  @hasMany({ model: Student }) students;
  @hasMany({ model: StudentTaskStep, inverseOf: 'task' }) steps;

  @session({ type: 'object' }) tasksMap;

  @computed get isReading() { return 'reading' === this.type; }
  @computed get isHomework() { return 'homework' === this.type; }
  @computed get isEvent() { return 'event' === this.type; }
  @computed get isExternal() { return 'external' === this.type; }
  @computed get isPractice() { return this.type && this.type.includes('practice'); }
  @observable isLoading = false

  @computed get isFeedbackAvailable() {
    return Boolean(
      !this.isHomework || !this.feedback_at || moment(this.feedback_at).isBefore(Time.now)
    );
  }

  @computed get publishedLateWorkPenalty() {
    return sumBy(this.steps, 'published_late_work_point_penalty');
  }

  @computed get publishedPoints() {
    return sumBy(this.steps, 'published_points');
  }

  @computed get course() {
    return this.tasksMap.course;
  }

  @computed get progress() {
    return defaults(
      countBy(this.steps, s => s.is_completed ? 'complete' : 'incomplete'), {
        complete: 0,
        incomplete: 0,
      }
    );
  }

  @computed get hasLateWorkPolicy() {
    return Boolean(this.isHomework || this.isReading);
  }

  @computed get humanLateWorkPenalty() {
    const amount = this.late_work_penalty_applied !== 'not_accepted' ? this.late_work_penalty_per_period : 1;
    return `${S.asPercent(amount)}%`;
  }

  @computed get availablePoints() {
    return sumBy(this.steps, 'available_points');
  }

  // if the task's first step is a placeholder, we want to keep fetching it until it isn't
  @computed get isLoaded() {
    return Boolean(this.api.hasBeenFetched && (isEmpty(this.steps) || !this.steps[0].isPlaceHolder));
  }

  @computed get dueAtMoment() {
    return this.course.momentInZone(this.due_at);
  }

  @computed get closesAtMoment() {
    return this.course.momentInZone(this.closes_at);
  }

  // attempt to load the task until isLoaded returns true or we exceed 30 attempts
  async load() {
    if (this.isLoading) return this;
    this.isLoading = true;
    try {
      let tries_remaining = 6;
      while(tries_remaining > 0) {
        await this.fetch();
        if (this.isLoaded) {
          break;
        }
        // exponential backoff between tries: 1, 2, 4 .. 32 (plus some milliseconds of random)
        await new Promise(resolve => setTimeout(resolve, 1000*(2**(6 - tries_remaining) + Math.random())));
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
