import {
  BaseModel, identifiedBy, field, belongsTo,
} from 'shared/model';
import { pick } from 'lodash';
import TeacherTaskPlan from './plan';

@identifiedBy('task-plans/teacher/grade')
export default class TeacherTaskGrade extends BaseModel {

  @belongsTo({ model: TeacherTaskPlan }) taskPlan;

  constructor({ response, points, comment }) {
    super();
    this.response = response;
    this.grader_points = points;
    this.grader_comments = comment;
  }

  @field grader_points;
  @field grader_comments;

  save() {
    return {
      task_step_id: this.response.task_step_id,
      data: pick(this, 'grader_points', 'grader_comments'),
    };
  }

  onGraded({ data }) {
    this.update(data);
    this.response.update(data);
  }
  // not clear how these are populated
  @field answer_id;
  @field free_response;
  @field response_validation;
  @field last_graded_at;
}
