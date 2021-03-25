import { BaseModel, field } from 'shared/model';

export default class TaskedStudent extends BaseModel {
  @field role_id;
  @field name;
}
