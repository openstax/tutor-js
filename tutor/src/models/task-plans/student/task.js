import { observable } from 'mobx';
import { computed } from 'mobx';
import { invoke, get } from 'lodash';
import moment from 'moment';
import Time from '../../time';
import {
  BaseModel, identifiedBy, field, identifier,
} from 'shared/model';


const StudentTaskFeedback = {
  homework(t) {
    if (!t.isStarted) { return 'Not started'; }
    return t.scoreShown ?
      `${t.correct_exercise_count}/${t.exercise_count} correct` :
      `${t.complete_exercise_count}/${t.exercise_count} answered`;
  },
  reading(t) {
    if (!t.isStarted) { return 'Not started'; }
    return t.complete ? 'Complete' : 'In progress';
  },
  external(t) {
    return t.complete ? 'Clicked' : 'Not started';
  },
};

export default
@identifiedBy('task-plans/student/task')
class StudentTask extends BaseModel {

  @observable hidden = false;

  @identifier id;
  @field title;
  @field type;
  @field complete;
  @field is_deleted;
  @field is_college;
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

  @computed get isStarted() {
    return this.completed_steps_count > 0;
  }

  @computed get isTeacherStudent() {
    return true === get(this, 'tasks.course.currentRole.isTeacherStudent');
  }

  @computed get isOpen() {
    return this.opens_at < Time.now;
  }

  @computed get canWork() {
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

  @computed get studentFeedback() {
    return invoke(StudentTaskFeedback, this.type, this) || '';
  }

  // called from API
  hide() {}
  onHidden() {
    this.hidden = true;
  }
}
