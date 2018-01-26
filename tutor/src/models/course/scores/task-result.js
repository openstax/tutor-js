import { filter, find, findIndex, reduce, isNil } from 'lodash';
import { computed, observable, action } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, hasMany, session, identifier,
} from '../../base';
import { TimeStore } from '../../../flux/time';

@identifiedBy('course/scores/task-result')
export default class TaskResult extends BaseModel {
  @identifier id;
  @session type;
  @session status;
  @session score;
  @session step_count;
  @session completed_step_count;
  @session completed_accepted_late_exercise_count;
  @session completed_accepted_late_step_count;
  @session completed_exercise_count;
  @session completed_on_time_exercise_count;
  @session completed_on_time_step_count;
  @session completed_step_count;
  @session correct_accepted_late_exercise_count
  @session correct_exercise_count
  @session correct_on_time_exercise_count
  @session({ type: 'date' }) due_at;
  @session exercise_count;
  @session is_included_in_averages;
  @session is_late_work_accepted;
  @session recovered_exercise_count;

  @belongsTo({ model: 'course/scores/student' }) student;

  @computed get columnIndex() {
    return findIndex(this.student.data, s => s === this);
  }

  @computed get lateStepCount() {
    if (this.type === 'homework') {
      return this.completed_exercise_count -
             this.completed_on_time_exercise_count -
             this.completed_accepted_late_exercise_count;
    }
    return this.completed_step_count -
           this.completed_on_time_step_count -
           this.completed_accepted_late_step_count;
  }

  @computed get hasLateWork() {
    return this.lateStepCount > 0;
  }

  @computed get isLate() {
    return this.completed_on_time_step_count < this.completed_step_count;
  }

  @computed get isStarted() {
    return Boolean(this.completed_step_count || this.completed_exercise_count);
  }

  // called by API
  acceptLate() {}
  rejectLate() {}

  onLateWorkAccepted() {
    // nothing to do if it's not actually late
    if (!this.hasLateWork) { return; }

    this.is_late_work_accepted = true;

    this.completed_accepted_late_exercise_count =
      this.completed_exercise_count - this.completed_on_time_exercise_count;
    this.correct_accepted_late_exercise_count =
      this.correct_exercise_count - this.correct_on_time_exercise_count;
    this.completed_accepted_late_step_count =
      this.completed_step_count - this.completed_on_time_step_count;

    this.accepted_late_at = TimeStore.getNow().toISOString();

    if (this.is_included_in_averages) {
      this.adjustAverages();
    }
  }

  onLateWorkRejected() {
    this.is_late_work_accepted = false;
    this.correct_accepted_late_exercise_count = 0;
    this.completed_accepted_late_exercise_count = 0;
    this.completed_accepted_late_step_count = 0;
    this.accepted_late_at = null;

    if (this.is_included_in_averages) {
      this.adjustAverages(this);
    }
  }


  adjustAverages() {

    const oldScore = this.score;

    const period = this.student.period;

    let student = this.student;

    // Update score for the task without rounding so the calculations below will use it's full precision
    this.score =
      (this.correct_on_time_exercise_count + this.correct_accepted_late_exercise_count ) / this.exercise_count;

    // Student's course average
    let numTasksStudent = reduce(student.data, (count, task) => task.is_included_in_averages ? count + 1 : count, 0);

    student.average_score =
      ( student.average_score - ( oldScore / numTasksStudent ) ) + ( this.score / numTasksStudent );

    // Assignment averages
    let numStudentsTask = reduce(period.students, (count, student) => {
      const task = student.data[this.columnIndex];
      return task.is_included_in_averages ? count + 1 : count;
    }, 0);

    const heading = this.student.period.data_headings[this.columnIndex];
    if (isNil(heading.average_score)) {
      heading.average_score = this.score / numStudentsTask;
    } else {
      heading.average_score =
        ( heading.average_score - ( oldScore / numStudentsTask ) ) +
                             ( this.score / numStudentsTask );
    }

    // Overall course averages
    // care must be taken that these methods match the BE routine tasks/get_tp_performance_report.rb
    let taskCount = reduce(period.students, (scount, student) => {
      return scount + reduce(student.data, (tcount, task) => task.is_included_in_averages ? tcount + 1 : tcount, 0);
    }, 0);


    const { course } = period.coursePeriod;

    period.overall_course_average_score =
      (period.overall_course_average_score - ( oldScore / taskCount ) ) +
                     ( this.score / taskCount );


    // Now round the score
    return this.score = Math.round(this.score * 100 ) / 100;
  }

}
