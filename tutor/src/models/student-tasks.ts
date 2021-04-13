import type Course from './course'
import { ID, getParentOf, hydrateModel, Map } from 'shared/model'
import urlFor from '../api'
import StudentTask from './student-tasks/task';
import StudentTaskStep from './student-tasks/step';

const PRACTICE = {
    WORST: 'worst',
    SAVED: 'saved',
};

class StudentTasks extends Map<ID, StudentTask> {
    static Model = StudentTask

    get course() { return getParentOf<Course>(this) }

    get(taskId: ID) {
        let task = super.get(taskId);
        if (!task) {
            task = hydrateModel(StudentTask, { id: taskId }, this)
            this.set(taskId, task);
        }
        return task
    }

    async practice(query: { type: 'worst' | 'saved', page_ids?: string[], practice_question_ids?: string[] }) {
        const url = (query.type === 'worst') ? urlFor('practiceWorstTasks', { courseId: this.course.id }) :
            urlFor('practiceSavedTasks', { courseId: this.course.id })

        return await this.api.request(url, {
            data: { page_ids: query.page_ids },
        })
    }
}

export { StudentTasks, StudentTask, StudentTaskStep, PRACTICE };
