import {
  BaseModel, identifiedBy, field, identifier, hasMany, session,
} from 'shared/model';
import StudentTaskStep from './task-step';

export { StudentTaskStep };

export default
@identifiedBy('student-tasks/task')
class StudentTask extends BaseModel {

  @identifier id;
  @field title;
  @field type;
  @field complete;

  @session({ type: 'object' }) tasksMap;

  @hasMany({ model: StudentTaskStep }) steps;

  // called by API
  fetch() { }

};
