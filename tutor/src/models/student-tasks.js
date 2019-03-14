import Map from 'shared/model/map';
import StudentTask from './student-tasks/task';

export
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

}

export { StudentTask };
