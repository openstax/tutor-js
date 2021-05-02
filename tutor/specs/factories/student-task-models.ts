import { TASK_TYPES } from './student-tasks';
import { range } from 'lodash'
import { hydrateModel } from 'shared/model'
import FactoryBot from 'object-factory-bot';

import { StudentTask, Course } from '../../src/models'

const TaskStepTypes = {
    reading: 'StudentTaskReadingStepContent',
    exercise: 'StudentTaskExerciseStepContent',
    interactive: 'StudentTaskInteractiveStepContent',
};

export function studentTask(attrs: any = {}, course: Course = hydrateModel(Course, FactoryBot.create('Course'))) {
    if (attrs.type && !TASK_TYPES[attrs.type]){ throw(`Unknown task type ${attrs.type}`); }
    const data = FactoryBot.create('StudentTask', attrs)
    const st = hydrateModel(StudentTask, data, course.studentTasks);
    course.studentTasks.set(st.id, st)
    st.steps.forEach((s) => {
        if (TaskStepTypes[s.type]) {
            const data = FactoryBot.create(TaskStepTypes[s.type])
            s.onLoaded(data);
        }
    })
    return st;
}

export function studentTasks({
    course = hydrateModel(Course, FactoryBot.create('Course')) as Course,
    count = 1,
    attributes = {},
} = {}) {
    range(count).forEach(() => studentTask(attributes, course));
    return course.studentTasks;
}
