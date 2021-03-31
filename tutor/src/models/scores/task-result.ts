import { findIndex, isNil } from 'lodash';
import { BaseModel, computed, model, field, NEW_ID, getParentOf } from 'shared/model';
import DateTime from 'shared/model/date-time';
import type Student from './student'
import ScoresHelper, { UNWORKED } from '../../helpers/scores';
import S from '../../helpers/string';
import Bignum from 'shared/model/bignum';

export default class TaskResult extends BaseModel {
    @field id = NEW_ID;
    @model(Bignum) score = Bignum.unknown;
    @field points = 0;
    @field published_points = 0;
    @field published_score = 0;
    @field is_provisional_score = false;
    @field step_count = 0;
    @field completed_step_count = 0;
    @model(DateTime) due_at = DateTime.unknown;
    @field progress = 0;
    @field is_late_work_accepted = false;
    @field available_points = 0;
    @field recovered_exercise_count = 0;

    // can be removed once old scores is removed
    @field completed_on_time_steps_count = 0;

    get student():Student { return getParentOf(this) }

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

  @computed get preWrmHumanScoreNumber() {
      // Pre-WRM scores don't get higher precision
      return `${isNil(this.published_points) ? '0' : S.numberWithOneDecimalPlace(this.published_points)} of ${S.numberWithOneDecimalPlace(this.available_points)}`;
  }

  @computed get isDue() {
      return moment(this.due_at).isBefore(Time.now);
  }

  @computed get humanScore() {
      const score = this.course.currentRole.isTeacher ? this.score : this.published_score;
      return isNil(score) ? UNWORKED : `${ScoresHelper.asPercent(score)}%`;
  }

  @computed get humanPoints() {
      const points = this.course.currentRole.isTeacher ? this.points : this.published_points;
      return isNil(points) ? UNWORKED : `${ScoresHelper.formatPoints(points)} of ${ScoresHelper.formatPoints(this.available_points)}`;
  }
}
