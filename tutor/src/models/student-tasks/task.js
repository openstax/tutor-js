import {
  BaseModel, identifiedBy, field, identifier, hasMany, session, computed,
} from 'shared/model';
import moment from 'moment';
import Time from '../time';
import StudentTaskStep from './step';

export { StudentTaskStep };

export default
@identifiedBy('student-tasks/task')
class StudentTask extends BaseModel {

  @identifier id;
  @field title;
  @field type;
  @field complete;
  @field({ type: 'date' }) due_at;
  @field({ type: 'date' }) feedback_at;
  @hasMany({ model: StudentTaskStep, inverseOf: 'task' }) steps;

  @session({ type: 'object' }) tasksMap;

  @computed get isReading() { return 'reading' === this.type; }
  @computed get isHomework() { return 'homework' === this.type; }

  @computed get isFeedbackAvailable() {
    return Boolean(
      !this.isHomework || moment(this.feedback_at).isBefore(Time.now)
    );
  }

  // called by API
  fetch() { }

}
