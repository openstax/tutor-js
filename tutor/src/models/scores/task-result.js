import { findIndex, isNaN } from 'lodash';
import { computed, action } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field,
} from 'shared/model';
import Big from 'big.js';
import moment from 'moment';
import Time from '../time';
import S from '../../helpers/string';

export default
@identifiedBy('scores/task-result')
class TaskResult extends BaseModel {
  @identifier id;
  @field type;
  @field status;
  @field({ type: 'bignum' }) score;
  @field points;
  @field step_count;
  @field completed_step_count;
  @field completed_accepted_late_exercise_count;
  @field completed_accepted_late_step_count;
  @field completed_exercise_count;
  @field completed_on_time_exercise_count;
  @field completed_on_time_steps_count;
  @field completed_step_count;
  @field correct_accepted_late_exercise_count;
  @field correct_exercise_count;
  @field correct_on_time_exercise_count;
  @field correct_on_time_step_count;
  @field correct_accepted_late_step_count;
  @field({ type: 'date' }) due_at;
  @field is_past_due;
  @field is_extended;
  @field exercise_count;
  @field is_included_in_averages;
  @field is_late_work_accepted;
  @field available_points;

  @field recovered_exercise_count;

  @belongsTo({ model: 'scores/student' }) student;
  @computed get period() { return this.student.period; }

  @computed get columnIndex() {
    return findIndex(this.student.data, s => s.id === this.id);
  }

  @computed get progress() {
    if (!this.step_count){ return null; }
    return this.completedStepCount / this.step_count;
  }

  @computed get isHomework() {
    return this.type === 'homework';
  }
  @computed get isExternal() {
    return this.type === 'external';
  }

  @computed get unacceptedLateStepCount() {
    return this.completed_step_count - this.completedStepCount;
  }

  @computed get hasUnacceptedLateWork() {
    return this.unacceptedLateStepCount > 0;
  }

  @computed get isStarted() {
    return Boolean(this.completed_step_count || this.completed_exercise_count);
  }
  
  @computed get canBeReviewed() {
    return Boolean(this.isStarted && !this.isExternal);
  }

  @computed get isTrouble() {
    return this.isStarted && this.score < 0.5;
  }

  @computed get reportHeading() {
    return this.student.period.data_headings[this.columnIndex];
  }

  // called by API
  acceptLate() {}
  rejectLate() {}

  // https://github.com/openstax/tutor-server/blob/master/app/subsystems/tasks/models/task.rb#L293-L298
  @action onLateWorkRejected() {
    this.is_late_work_accepted = false;
    this.completed_accepted_late_exercise_count = 0;
    this.correct_accepted_late_exercise_count = 0;
    this.completed_accepted_late_step_count = 0;
    this.accepted_late_at = null;

    this.adjustScore();
  }

  // https://github.com/openstax/tutor-server/blob/master/app/subsystems/tasks/models/task.rb#L286-L291
  @action onLateWorkAccepted() {
    // nothing to do if it's not actually late
    if (!this.hasUnacceptedLateWork) { return; }
    this.completed_accepted_late_step_count = this.completed_step_count;
    this.completed_accepted_late_exercise_count = this.completed_exercise_count;
    this.correct_accepted_late_exercise_count = this.correct_exercise_count;
    this.is_late_work_accepted = true;
    this.accepted_late_at = Time.now.toISOString();
    this.adjustScore();
  }

  @computed get completedStepCount() {
    return Math.max(this.completed_step_count, this.completed_on_time_steps_count);
  }

  @computed get completedExerciseCount() {
    return Math.max(this.completed_on_time_exercise_count,
      this.completed_accepted_late_exercise_count);
  }

  @computed get correctExerciseCount() {
    return Math.max(this.correct_on_time_exercise_count,
      this.correct_accepted_late_exercise_count);
  }

  @action adjustScore() {
    if (this.exercise_count) {
      this.score = new Big(this.correctExerciseCount).div(this.exercise_count);
    } else {
      this.score = new Big(0);
    }
    this.student.adjustScores(this);
    this.period.adjustScores(this);
    this.reportHeading.adjustScores();
  }

  @computed get completedPercent() {
    const percent = this.completedStepCount / this.step_count;
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
    return `${S.numberWithOneDecimalPlace(this.points)}  of  ${S.numberWithOneDecimalPlace(this.available_points)}`;
  }

  @computed get isDue() {
    return moment(this.due_at).isBefore(Time.now);
  }


}
