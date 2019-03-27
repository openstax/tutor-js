import { isEmpty } from 'lodash';
import Map from 'shared/model/map';
import StudentTask from './student-tasks/task';
import StudentTaskStep from './student-tasks/step';

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

  practice({ page_ids }, { pattern }) {
    const req = {
      courseId: this.course.id,
      data: { page_ids },
    };
    if (isEmpty(page_ids)) {
      req.pattern = pattern + '/worst';
    }
    return req;
  }
}

export { StudentTasks, StudentTask, StudentTaskStep };
