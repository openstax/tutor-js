import { BaseModel, model } from 'shared/model';

export default class TaskPlanReview extends BaseModel {

    @model('task-plans/teacher/plan') taskPlan;

    fetch() {
        return { id: this.taskPlan.id };
    }
}
