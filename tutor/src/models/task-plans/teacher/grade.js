import {
  BaseModel, identifiedBy, field, belongsTo,
} from 'shared/model';
import { pick } from 'lodash';
import TeacherTaskPlan from './plan';

export default
@identifiedBy('task-plans/teacher/grade')
class TeacherTaskGrade extends BaseModel {

  @belongsTo({ model: TeacherTaskPlan }) taskPlan;

  constructor({ question, points, comment }) {
    super();
    this.question = question;
    this.grader_points = points;
    this.grader_comments = comment;
  }

  @field grader_points;
  @field grader_comments;

  save() {
    return {
      task_step_id: this.question.task_step_id,
      data: pick(this, 'grader_points', 'grader_comments'),
    };
  }

  onGraded({ data }) {
    this.update(data);
    this.question.update(data);
  }
  // not clear how these are populated
  @field answer_id;
  @field free_response;
  @field response_validation;
  @field last_graded_at;
}
