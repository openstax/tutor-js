import { BaseModel, identifiedBy, field } from 'shared/model';

export default
@identifiedBy('student-tasks/student')
class TaskedStudent extends BaseModel {
  @field role_id;
  @field name;
}
