import { observable } from 'mobx';
import { computed } from 'mobx';
import { get, isNil } from 'lodash';
import S from '../../../helpers/string';
import moment from 'moment';
import Time from '../../time';
import {
  BaseModel, identifiedBy, field, identifier,
} from 'shared/model';


export default
@identifiedBy('task-plans/student/task')
class StudentTask extends BaseModel {

  @observable hidden = false;

  @identifier id;
  @field title;
  @field type;
  @field complete;
  @field score;
  @field is_provisional_score;
  @field is_deleted;
  @field is_college;
  @field is_extended;
  @field is_past_due;
  @field complete_exercise_count = 0;
  @field correct_exercise_count;
  @field exercise_count = 0;
  @field completed_accepted_late_exercise_count = 0;
  @field completed_on_time_exercise_count = 0;
  @field task_plan_id;
  @field steps_count = 0;
  @field completed_steps_count = 0;
  @field completed_on_time_steps_count = 0;
  @field completed_accepted_late_steps_count = 0;
  @field description;
  @field({ type: 'date' }) last_worked_at;
  @field({ type: 'date' }) due_at;
  @field({ type: 'date' }) opens_at;
  @field({ type: 'date' }) accepted_late_at;

  constructor(attrs, studentTasks) {
    super(attrs);
    this.tasks = studentTasks;
  }

  @computed get workedLate() {
    return Boolean(
      this.last_worked_at && moment(this.last_worked_at).isAfter(this.due_at)
    );
  }

  @computed get isPastDue() {
    return moment(this.due_at).isBefore(Time.now);
  }

  @computed get isAlmostDue() {
    return moment(Time.now).isBetween(
      moment(this.due_at).subtract(1, 'day'),
      this.due_at,
    );
  }

  @computed get scoreShown() {
    return Boolean(this.isPastDue && this.complete);
  }

  @computed get lateWorkIsAccepted() {
    return Boolean(
      this.accepted_late_at &&
        this.last_worked_at &&
        moment(this.accepted_late_at).isAfter(this.last_worked_at)
    );
  }

  @computed get isHomework() {
    return 'homework' === this.type;
  }

  @computed get isReading() {
    return 'reading' === this.type;
  }

  @computed get isExternal() {
    return 'external' == this.type;
  }

  @computed get isStarted() {
    return this.completed_steps_count > 0;
  }

  @computed get isHidden() {
    return Boolean(this.hidden || (this.is_deleted && !this.isStarted));
  }

  @computed get isTeacherStudent() {
    return true === get(this, 'tasks.course.currentRole.isTeacherStudent');
  }

  @computed get isOpen() {
    return this.opens_at < Time.now;
  }

  @computed get isViewable() {
    //students cannot work or view a task if it has been deleted and they haven't started it
    return Boolean(
      this.isTeacherStudent || (
        this.isOpen && !(
          this.is_deleted &&
            this.complete_exercise_count === 0
        )
      )
    );
  }

  @computed get humanProgress() {
    if (this.isHomework) {
      if (!this.isStarted) { return 'Not started'; }
      return this.homeworkProgressSteps;
    } else if (this.isReading) {
      if (!this.isStarted) { return 'Not started'; }
      return this.complete ? 'Complete' : 'In progress';
    } else if (this.isExternal) {
      return this.complete ? 'Clicked' : 'Not started';
    }
    return '';
  }

  @computed get homeworkProgressSteps() {
    return `${this.completed_steps_count}/${this.steps_count} completed`;
  }

  @computed get humanScore() {
    return isNil(this.score) ? '---' : S.numberWithOneDecimalPlace(this.score);
  }

  // called from API
  hide() {}
  onHidden() {
    this.hidden = true;
  }
}
