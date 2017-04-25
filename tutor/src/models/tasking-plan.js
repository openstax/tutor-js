import {
  BaseModel, identifiedBy, field,
} from './base';

@identifiedBy('tasking-plan')
export default class TaskingPlan extends BaseModel {

  @field target_id;
  @field target_type;

  @field({ type: 'date' }) opens_at;
  @field({ type: 'date' }) due_at;

}
