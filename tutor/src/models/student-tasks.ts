import { isEmpty } from 'lodash';
import Map from 'shared/model/map';
import StudentTask from './student-tasks/task';
import StudentTaskStep from './student-tasks/step';

const PRACTICE = {
    WORST: 'worst',
    SAVED: 'saved',
};

class StudentTasks extends Map {

  static Model = StudentTask;

  constructor({ course } = {}) {
      super();
      this.course = course;
  }

  get(taskId) {
      let task = super.get(taskId);
      if (!task) {
          task = new StudentTask({ id: taskId, tasksMap: this });
          this.set(taskId, task);
      }
      return task;
  }

  practice(query, interceptor) {
      const req = {
          courseId: this.course.id,
      };
    
      if (query.type === PRACTICE.WORST) {
          req.data = {
              page_ids: query.page_ids,
          };
          if (isEmpty(query.page_ids)) {
              req.pattern = interceptor.pattern + '/worst';
          }
      }
      else if (query.type === PRACTICE.SAVED) {
          req.data = {
              practice_question_ids: query.practice_question_ids,
          };
          req.pattern = interceptor.pattern + '/saved';
      }
      return req;
  }
}

export { StudentTasks, StudentTask, StudentTaskStep, PRACTICE };
