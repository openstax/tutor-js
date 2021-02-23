import {
  BaseModel, identifiedBy, identifier, hasMany, computed, action,
} from 'shared/model';
import StudentTaskStep from './step';
import { readonly } from 'core-decorators';

@identifiedBy('student-tasks/step-group')
export default class StudentTaskStepGroup extends BaseModel {

  @identifier uid;
  @hasMany({ model: StudentTaskStep }) steps;

  @readonly isGrouped = true;
  @readonly type = 'mpq';

  static key(s) {
    return `${s.type}.${s.uid || s.id}`;
  }

  constructor(attrs) {
    super(attrs);
    this.steps.forEach((s) => s.multiPartGroup = this);
  }

  @computed get needsFetched() {
    return Boolean(this.steps.find(s => s.needsFetched));
  }

  getStepAfter(step) {
    const indx = this.steps.indexOf(step);
    if (indx != -1 && indx < this.steps.length - 1) {
      return this.steps[indx + 1];
    }
    return null;
  }

  fetchIfNeeded() {
    return this.steps.map(s => s.fetchIfNeeded());
  }

  @action markViewed() {
    this.steps.forEach(s => s.markViewed());
  }

  includesStep(step) {
    return -1 !== this.steps.indexOf(step);
  }
}
