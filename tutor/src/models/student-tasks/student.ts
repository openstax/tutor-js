import { BaseModel, field, NEW_ID } from 'shared/model';

export default class TaskedStudent extends BaseModel {
  @field role_id = NEW_ID;
  @field name = '';
}
