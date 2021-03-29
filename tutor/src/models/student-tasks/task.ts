import { BaseModel, field, model, action, computed, observable, NEW_ID } from 'shared/model';
import DateTime from 'shared/model/date-time';
import moment from 'moment';
import { defaults, countBy, isEmpty, sumBy } from 'lodash';
import StudentTaskStep from './step';
import Student from './student';
import S from '../../helpers/string';
import Time from '../../models/time';
export { StudentTaskStep };

export default class StudentTask extends BaseModel {

  @field id = NEW_ID;
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
  @field spy?: any;
  @model(DateTime) due_at?: DateTime;
  @model(DateTime) closes_at?: DateTime;

  @field is_provisional_score;

  @model(Student) students = [];
  @model(StudentTaskStep) steps = [];

  @observable tasksMap?: any;

  @computed get isReading() { return 'reading' === this.type; }
  @computed get isHomework() { return 'homework' === this.type; }
  @computed get isEvent() { return 'event' === this.type; }
  @computed get isExternal() { return 'external' === this.type; }

  @computed get isPractice() { return ['practice_saved', 'page_practice', 'practice_worst_topics'].includes(this.type); }
  @computed get isSavedPractice() { return this.type === 'practice_saved'; }
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

  // due_at/closes at will not be set for task of type "practice"
  @computed get dueAtMoment() {
      return this.due_at && moment(this.due_at);
  }

  @computed get closesAtMoment() {
      return this.closes_at && moment(this.closes_at);
  }

  @computed get isAssignmentClosed() {
      return Boolean(this.closes_at && this.closesAtMoment.isSameOrBefore(Time.now));
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

  exit() {
      return {
          courseId: this.course.id,
          id: this.id,
      };
  }
}
