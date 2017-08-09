import {
  BaseModel, identifiedBy, field, identifier, hasMany,
} from './base';

import { action, computed } from 'mobx';
import PlanHelper from '../helpers/plan';
import TaskingPlan from './tasking-plan';
import { TaskPlanStore } from '../flux/task-plan';

@identifiedBy('teacher-task-plan')
export default class TeacherTaskPlan extends BaseModel {

  @identifier id;
  @field title;
  @field type;

  @field ecosystem_id;
  @field({ type: 'date' }) first_published_at
  @field({ type: 'date' }) last_published_at;

  @field is_draft;
  @field is_preview;
  @field is_published;
  @field is_publishing;
  @field is_trouble;
  @field cloned_from_id;
  @field is_deleting;

  @field({ type: 'object' }) settings;
  @hasMany({ model: TaskingPlan }) tasking_plans;

  @computed get isClone() {
    return !!this.cloned_from_id;
  }

  @action
  onPlanSave(plan) {
    this.update(plan);
    PlanHelper.subscribeToPublishing(plan, this.onPlanPublish);
  }

  @action.bound
  onPlanPublish(publish) {
    if (publish.status === 'succeeded') {
      const plan = TaskPlanStore.get(this.id);
      this.update(plan);
      PlanHelper.unsubscribeFromPublishing(this.id, this.onPlanPublish);
    }
  }

}
