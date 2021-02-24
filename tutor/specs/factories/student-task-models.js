import StudentTask from '../../src/models/student-tasks/task';
import { TASK_TYPES } from './student-tasks';
const { range } = require('lodash');

const TaskStepTypes = {
    reading: 'StudentTaskReadingStepContent',
    exercise: 'StudentTaskExerciseStepContent',
    interactive: 'StudentTaskInteractiveStepContent',
};

export
function studentTask(attrs = {}, modelArgs) {
    if (attrs.type && !TASK_TYPES[attrs.type]){ throw(`Unknown task type ${attrs.type}`); }

    const st = new StudentTask(this.bot.create('StudentTask', attrs), modelArgs);
    st.steps.forEach((s) => {
        s.onLoaded({ data: this.bot.create(TaskStepTypes[s.type]) });
    })
    return st;
}

export
function studentTasks({
    course = this.course(),
    count = 1,
    attributes = {},
} = {}) {
    range(count).forEach(() => {
        const task = this.studentTask(attributes);
        task.tasksMap = course.studentTasks;
        course.studentTasks.set(task.id, task)
    })
    return course.studentTasks;
}
