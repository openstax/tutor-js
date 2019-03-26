import {
  BaseModel, identifiedBy, field, identifier, hasMany, session, computed,
} from 'shared/model';
import { defaults, countBy } from 'lodash';
import moment from 'moment';
import Time from '../time';
import StudentTaskStep from './step';

export { StudentTaskStep };

export default
@identifiedBy('student-tasks/task')
class StudentTask extends BaseModel {

  @identifier id;
  @field title;
  @field description;
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

  @computed get progress() {
    return defaults(
      countBy(this.steps, s => s.is_completed ? 'complete' : 'incomplete'), {
        complete: 0,
        incomplete: 0,
      }
    );
  }

  // called by API
  fetch() { }

}
