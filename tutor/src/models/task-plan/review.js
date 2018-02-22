import {
  BaseModel, belongsTo, identifiedBy, session, hasMany, field, identifier,
} from 'shared/model';
import { computed } from 'mobx';


@identifiedBy('task-plan/review')
export default class TaskPlanReview extends BaseModel {

  @belongsTo({ model: 'task-plan/teacher' }) taskPlan;

  fetch() {
    return { id: this.taskPlan.id };
  }
}
