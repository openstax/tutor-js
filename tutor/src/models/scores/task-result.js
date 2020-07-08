import { findIndex, isNil } from 'lodash';
import { computed } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, moment,
} from 'shared/model';
import Time from '../time';
import S, { UNWORKED } from '../../helpers/string';

export default
@identifiedBy('scores/task-result')
class TaskResult extends BaseModel {
  @identifier id;
  @field({ type: 'bignum' }) score;
  @field points;
  @field published_points;
  @field published_score;
  @field is_provisional_score;
  @field step_count;
  @field completed_step_count;
  @field({ type: 'date' }) due_at;
  @field progress;
  @field is_late_work_accepted;
  @field available_points;
  @field recovered_exercise_count;

  // can be removed once old scores is removed
  @field completed_on_time_steps_count;

  @belongsTo({ model: 'scores/student' }) student;
  @computed get period() { return this.student.period; }
  @computed get course() { return this.student.period.course; }

  @computed get columnIndex() {
    return findIndex(this.student.data, s => s.id === this.id);
  }

  @computed get isHomework() {
    return this.type === 'homework';
  }
  @computed get isExternal() {
    return this.type === 'external';
  }
  @computed get isReading() {
    return this.type === 'reading';
  }

  @computed get isStarted() {
    return Boolean(this.completed_step_count);
  }
  
  @computed get canBeReviewed() {
    return Boolean(this.isStarted && !this.isExternal);
  }

  @computed get isTrouble() {
    return this.isStarted && this.score < 0.5;
  }

  @computed get reportHeading() {
    return this.period.data_headings[this.columnIndex];
  }

  @computed get type() {
    return this.reportHeading.type;
  }

  @computed get isExtended() {
    return moment(this.due_at).isAfter(this.reportHeading.due_at);
  }

  @computed get completedPercent() {
    return Math.round(this.progress * 100);
  }

  @computed get humanProgress() {
    return `${this.completed_step_count} of ${this.step_count}`;
  }

  @computed get humanCompletedPercent() {
    return `${this.completedPercent}%`;
  }

  @computed get humanScoreNumber() {
    return `${isNil(this.published_score) ? '0' : S.numberWithOneDecimalPlace(this.published_points)} of ${S.numberWithOneDecimalPlace(this.available_points)}`;
  }

  @computed get isDue() {
    return moment(this.due_at).isBefore(Time.now);
  }

  @computed get humanScore() {
    const score = this.course.currentRole.isTeacher ? this.score : this.published_score;
    return isNil(score) ? UNWORKED : S.asPercent(score) + '%';
  }

  @computed get humanPoints() {
    const points = this.course.currentRole.isTeacher ? this.points : this.published_points;
    return isNil(points) ? UNWORKED : `${S.numberWithOneDecimalPlace(points)} of ${S.numberWithOneDecimalPlace(this.available_points)}`;
  }
}
