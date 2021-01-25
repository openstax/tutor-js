import { BaseModel, identifiedBy, field } from 'shared/model';

@identifiedBy('student-tasks/student')
export default class TaskedStudent extends BaseModel {
  @field role_id;
  @field name;
}
