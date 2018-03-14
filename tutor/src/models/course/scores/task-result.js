import { filter, find, includes, findIndex, reduce, isNil } from 'lodash';
import { computed, observable, action } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, hasMany, session, identifier, field,
} from 'shared/model';
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
  @field correct_accepted_late_exercise_count;
  @field correct_exercise_count;
  @field correct_on_time_exercise_count;
  @field correct_on_time_step_count;
  @field correct_accepted_late_step_count;
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

  @computed get reportHeading() {
    return this.student.period.data_headings[this.columnIndex];
  }

  // called by API
  acceptLate() {}
  rejectLate() {}


  onLateWorkRejected() {
    const prevLateSteps = this.completed_accepted_late_step_count;
    const prevCorrect = this.correct_accepted_late_exercise_count;

    this.is_late_work_accepted = false;
    this.completed_accepted_late_exercise_count = 0;
    this.correct_accepted_late_exercise_count = 0;
    this.completed_accepted_late_step_count = 0;
    this.accepted_late_at = null;

    if (this.is_included_in_averages) {
      this.adjustAverages(
        prevLateSteps + this.completed_on_time_step_count,
        prevCorrect + this.correct_on_time_exercise_count,
      );
    }
  }

  onLateWorkAccepted() {
    // nothing to do if it's not actually late
    if (!this.hasLateWork) { return; }

    const prevLateSteps = this.completed_accepted_late_step_count;
    const prevCorrect = this.correct_accepted_late_exercise_count;

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
        prevLateSteps + this.completed_on_time_step_count,
        prevCorrect + this.correct_on_time_exercise_count,
      );
    }
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

  adjustAverages(prevCompletedStepCount, prevCorrect) {
    const oldScore = this.score;
    const period = this.student.period;
    const { course } = period.coursePeriod;
    const { type } = this;
    let student = this.student;

    // Update score for the task without rounding so the calculations below will use it's full precision
    this.score = (
      this.correct_on_time_exercise_count + this.correct_accepted_late_exercise_count
    ) / this.exercise_count;

    //----------------------------------------------------------------+
    // scores                                                         |
    //----------------------------------------------------------------+

    // student
    student[`${type}_score`] += (
      this.scoredCorrectCount / student.scoredStepCount[type]
    ) - ( prevCorrect / student.scoredStepCount[type] );
    // assignment
    this.reportHeading.average_score += (
      this.scoredCorrectCount / this.reportHeading.scoredStepCount
    ) - ( prevCorrect / this.reportHeading.scoredStepCount );
    // period
    period[`overall_${type}_score`] += course[`${type}_score_weight`] * (
      ( this.scoredCorrectCount / period.scoredStepCount[type] ) -
        ( prevCorrect / period.scoredStepCount[type] )
    );

    //----------------------------------------------------------------+
    // progress                                                       |
    //----------------------------------------------------------------+

    // student
    student[`${type}_progress`] += (
      this.completedStepCount / student.scoredStepCount[type]
    ) - ( prevCompletedStepCount / student.scoredStepCount[type] );
    // assignment
    this.reportHeading.average_progress += (
      this.completedStepCount / this.reportHeading.scoredStepCount
    ) - ( prevCompletedStepCount / this.reportHeading.scoredStepCount );
    // period
    period[`overall_${type}_progress`] += course[`${type}_progress_weight`] * (
      ( this.completedStepCount / period.scoredStepCount[type] ) -
        ( prevCompletedStepCount / period.scoredStepCount[type] )
    );

    // Now round the score
    return this.score = Math.round(this.score * 100 ) / 100;
  }

}
