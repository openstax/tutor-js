import {
  BaseModel, belongsTo, identifiedBy,
} from 'shared/model';

export default
@identifiedBy('task-plan/review')
class TaskPlanReview extends BaseModel {

  @belongsTo({ model: 'task-plan/teacher' }) taskPlan;

  fetch() {
    return { id: this.taskPlan.id };
  }
};
