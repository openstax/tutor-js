import {
    BaseModel, belongsTo, identifiedBy,
} from 'shared/model';

@identifiedBy('task-plan/review')
export default class TaskPlanReview extends BaseModel {

  @belongsTo({ model: 'task-plans/teacher/plan' }) taskPlan;

  fetch() {
      return { id: this.taskPlan.id };
  }
}
