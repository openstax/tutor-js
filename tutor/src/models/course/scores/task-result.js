import { findIndex, isNan } from 'lodash';
import { computed, action } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field,
} from 'shared/model';
import Big from 'big.js';
import moment from 'moment';
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
    if (!this.step_count){ return null; }
    const count = this.completed_on_time_step_count + this.completed_accepted_late_step_count;
    return count / this.step_count;
  }

  @computed get isHomework() {
    return this.type === 'homework';
  }

  @computed get lateStepCount() {
    if (this.isHomework) {
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
    return Math.max(this.completed_accepted_late_step_count,
      this.completed_on_time_step_count);
  }

  @computed get completedExerciseCount() {
    return Math.max(this.completed_on_time_exercise_count,
      this.completed_accepted_late_exercise_count);
  }

  @computed get correctExerciseCount() {
    return Math.max(this.correct_on_time_exercise_count,
      this.correct_accepted_late_exercise_count);
  }

  @computed get scoredStepCount() {
    return this.completed_on_time_exercise_count + this.completed_accepted_late_exercise_count;
  }

  @computed get scoredCorrectCount() {
    return this.correct_on_time_exercise_count + this.correct_accepted_late_exercise_count;
  }

  @action adjustScore() {
    if (this.exercise_count) {
      this.score = new Big(
        this.correct_on_time_exercise_count + this.correct_accepted_late_exercise_count
      ).div(this.exercise_count);
    } else {
      this.score = new Big(0);
    }
    this.student.adjustScores(this);
    this.period.adjustScores(this);
    this.reportHeading.adjustScores();
  }

  @computed get completedPercent() {
    const percent = this.isHomework ?
      (this.completedExerciseCount / this.exercise_count) :
      (this.completedStepCount / this.step_count);
    return Math.round(percent * 100);
  }

  @computed get humanProgressWithLateWork() {
    const percent = this.isHomework ?
      this.completed_exercise_count / this.exercise_count :
      this.completed_step_count / this.step_count;
    if (isNaN(percent)) {
      return '0%';
    }
    return `${Math.round(percent * 100)}%`;
  }

  @computed get humanUnacceptedProgress() {
    if (!this.completed_on_time_exercise_count || !this.exercise_count) {
      return '0%';
    }
    const progress = Math.round((
      this.completed_on_time_exercise_count / this.exercise_count
    ) * 100 );
    return `${progress}%`;
  }

  @computed get humanScoreWithLateWork() {
    if (!this.correct_exercise_count || !this.exercise_count) {
      return '0%';
    }
    const score = Math.round((
      this.correct_exercise_count / this.exercise_count
    ) * 100 );
    return `${score}%`;
  }

  @computed get humanUnacceptedScore() {
    if (!this.correct_on_time_exercise_count || !this.exercise_count) {
      return '0%';
    }
    const score = Math.round((
      this.correct_on_time_exercise_count / this.exercise_count
    ) * 100 );
    return `${score}%`;
  }

  @computed get hasAdditionalLateWork() {
    return this.completed_accepted_late_step_count &&
      this.completed_step_count > this.completedStepCount;
  }

  @computed get humanProgress() {
    return `${this.completedStepCount} of ${this.step_count}`;
  }

  @computed get humanCompletedPercent() {
    return `${this.completedPercent}%`;
  }

  @computed get humanScoreNumber() {
    return `${this.correctExerciseCount} of ${this.exercise_count}`;
  }

  @computed get isDue() {
    return moment(this.due_at).isBefore(TimeStore.getNow());
  }


}
