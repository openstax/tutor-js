import {
  BaseModel, identifiedBy, field, identifier, hasMany, action, session, computed, observable,
} from 'shared/model';
import moment from 'moment';
import { defaults, countBy, isEmpty, sumBy } from 'lodash';
import StudentTaskStep from './step';
import Student from './student';
import S from '../../helpers/string';
import Time from '../../models/time';
export { StudentTaskStep };

export default
@identifiedBy('student-tasks/task')
class StudentTask extends BaseModel {

  @identifier id;
  @field title;
  @field description;
  @field type;
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
    return moment(this.due_at);
  }

  @computed get closesAtMoment() {
    return moment(this.closes_at);
  }
  
  @computed get isAssignmentClosed() {
    return this.closesAtMoment.isSameOrBefore(Time.now);
  }

  @computed get completed() {
    return this.steps.every(s => s.is_completed);
  }

  @computed get started() {
    return this.steps.some(s => s.is_completed);
  }

  // called by API
  fetch() { }
  @action onFetchComplete({ data }) {
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
