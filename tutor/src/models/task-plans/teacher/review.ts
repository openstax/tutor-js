import { BaseModel, belongsTo } from 'shared/model';

export default class TaskPlanReview extends BaseModel {

  @belongsTo({ model: 'task-plans/teacher/plan' }) taskPlan;

  fetch() {
      return { id: this.taskPlan.id };
  }
}
