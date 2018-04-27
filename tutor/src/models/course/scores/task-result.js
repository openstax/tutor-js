import { findIndex } from 'lodash';
import { computed, action } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field,
} from 'shared/model';
import Big from 'big.js';
import { TimeStore } from '../../../flux/time';

@identifiedBy('course/scores/task-result')
export default class TaskResult extends BaseModel {
  @identifier id;
  @field type;
  @field status;
  @field({ type: 'bignum' }) score;
  @field step_count;
  @field completed_step_count;
  @field completed_accepted_late_exercise_count;
  @field completed_accepted_late_step_count;
  @field completed_exercise_count;
  @field completed_on_time_exercise_count;
  @field completed_on_time_step_count;
  @field completed_step_count;
  @field correct_accepted_late_exercise_count;
  @field correct_exercise_count;
  @field correct_on_time_exercise_count;
  @field correct_on_time_step_count;
  @field correct_accepted_late_step_count;
  @field({ type: 'date' }) due_at;
  @field({ type: 'date' }) last_worked_at;
  @field exercise_count;
  @field is_included_in_averages;
  @field is_late_work_accepted;
  @field recovered_exercise_count;

  @belongsTo({ model: 'course/scores/student' }) student;
  @computed get period() { return this.student.period; }

  @computed get columnIndex() {
    return findIndex(this.student.data, s => s === this);
  }

  @computed get progress() {
    let count;
    if ('homework' === this.type) {
      count = this.completed_on_time_exercise_count + this.completed_accepted_late_exercise_count;
      return count / this.exercise_count;
    } else {
      count = this.completed_on_time_step_count + this.completed_accepted_late_step_count;
      return count / this.step_count;
    }
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

  @computed get reportHeading() {
    return this.student.period.data_headings[this.columnIndex];
  }

  // called by API
  acceptLate() {}
  rejectLate() {}

  @action onLateWorkRejected() {
    this.is_late_work_accepted = false;
    this.completed_accepted_late_exercise_count = 0;
    this.correct_accepted_late_exercise_count = 0;
    this.completed_accepted_late_step_count = 0;
    this.accepted_late_at = null;

    this.adjustScore();
  }

  @action onLateWorkAccepted() {
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

    this.adjustScore();
  }

  @computed get completedStepCount() {
    return this.completed_accepted_late_step_count + this.completed_on_time_step_count;
  }

  @computed get scoredStepCount() {
    return this.completed_on_time_exercise_count + this.completed_accepted_late_exercise_count;
  }

  @computed get scoredCorrectCount() {
    return this.correct_on_time_exercise_count + this.correct_accepted_late_exercise_count;
  }

  @action adjustScore() {
    this.is_included_in_averages = true;

    this.score = new Big(
      this.correct_on_time_exercise_count + this.correct_accepted_late_exercise_count
    ).div(this.exercise_count);

    this.student.adjustScores(this);
    this.period.adjustScores(this);
    this.reportHeading.adjustScores();
  }

}
