import {
  BaseModel, identifiedBy, field, identifier, hasMany,
} from './base';

import TaskingPlan from './tasking-plan';

@identifiedBy('teacher-task-plan')
export default class TeacherTaskPlan extends BaseModel {

  @identifier id;
  @field title;
  @field type;

  @field ecosystem_id;
  @field({ type: 'date' }) first_published_at
  @field({ type: 'date' }) last_published_at;

  @field is_draft;
  @field is_published;
  @field is_publishing;
  @field is_trouble;
  @field({ type: 'object' }) settings;
  @hasMany({ model: TaskingPlan }) tasking_plans;

}
