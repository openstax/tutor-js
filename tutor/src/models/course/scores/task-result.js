import { filter, find, includes, findIndex, reduce, isNil } from 'lodash';
import { computed, observable, action } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, hasMany, session, identifier, field,
} from '../../base';
import { TimeStore } from '../../../flux/time';

@identifiedBy('course/scores/task-result')
export default class TaskResult extends BaseModel {
  @identifier id;
  @field type;
  @field status;
  @field score;
  @field step_count;
  @field completed_step_count;
  @field completed_accepted_late_exercise_count;
  @field completed_accepted_late_step_count;
  @field completed_exercise_count;
  @field completed_on_time_exercise_count;
  @field completed_on_time_step_count;
  @field completed_step_count;
  @field correct_accepted_late_exercise_count
  @field correct_exercise_count
  @field correct_on_time_exercise_count
  @field({ type: 'date' }) due_at;
  @field exercise_count;
  @field is_included_in_averages;
  @field is_late_work_accepted;
  @field recovered_exercise_count;

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
    const previous_steps = this.completed_accepted_late_step_count;

    this.is_late_work_accepted = true;

    this.completed_accepted_late_exercise_count =
      this.completed_exercise_count - this.completed_on_time_exercise_count;
    this.correct_accepted_late_exercise_count =
      this.correct_exercise_count - this.correct_on_time_exercise_count;
    this.completed_accepted_late_step_count =
      this.completed_step_count - this.completed_on_time_step_count;

    this.accepted_late_at = TimeStore.getNow().toISOString();

    if (this.is_included_in_averages) {
      this.adjustAverages(
        this.completed_accepted_late_step_count - previous_steps
      );
    }
  }

  onLateWorkRejected() {
    const previous_steps = this.completed_accepted_late_step_count;
    this.is_late_work_accepted = false;
    this.correct_accepted_late_exercise_count = 0;
    this.completed_accepted_late_exercise_count = 0;
    this.completed_accepted_late_step_count = 0;
    this.accepted_late_at = null;

    if (this.is_included_in_averages) {
      this.adjustAverages(
        this.completed_accepted_late_step_count - previous_steps
      );
    }
  }


  adjustAverages(stepCountDifference) {

    const oldScore = this.score;

    const period = this.student.period;

    let student = this.student;

    // Update score for the task without rounding so the calculations below will use it's full precision
    this.score =
      (this.correct_on_time_exercise_count + this.correct_accepted_late_exercise_count ) / this.exercise_count;

    // Student's course average
    let numTasksStudent = reduce(student.data, (count, task) => task.is_included_in_averages ? count + 1 : count, 0);

    student.course_average =
      ( student.course_average - ( oldScore / numTasksStudent ) ) + ( this.score / numTasksStudent );

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

    let taskCount = reduce(period.students, (scount, student) => {
      return scount + reduce(student.data, (tcount, task) => task.is_included_in_averages ? tcount + 1 : tcount, 0);
    }, 0);

    if (includes(['homework', 'reading'], this.type)) {
      period[`overall_${this.type}_progress`] =
        (period[`overall_${this.type}_progress`] -
          ( stepCountDifference / taskCount ) ) +
                      ( this.completed_accepted_late_step_count -
                        stepCountDifference / taskCount );

      period[`overall_${this.type}_score`] =
        (period[`overall_${this.type}_score`] -
          ( oldScore / taskCount ) ) +
                        ( this.score / taskCount );
    }

    period.overall_course_average =
      (period.overall_course_average - ( oldScore / taskCount ) ) +
                             ( this.score / taskCount );

    // Now round the score
    return this.score = Math.round(this.score * 100 ) / 100;
  }

}
