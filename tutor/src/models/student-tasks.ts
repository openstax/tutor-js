import type Course from './course'
import { ID } from 'shared/model'
import urlFor from '../api'
import Map, { getParentOf, hydrateModel } from 'shared/model/map';
import StudentTask from './student-tasks/task';
import StudentTaskStep from './student-tasks/step';

const PRACTICE = {
    WORST: 'worst',
    SAVED: 'saved',
};

class StudentTasks extends Map<ID, StudentTask> {

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
        let reply: any
        if (query.type === 'worst') {
            reply = await this.api.request(urlFor('practiceWorstTasks', { courseId: this.course.id }), {
                page_ids: query.page_ids,
            })
        } else {
            reply = await this.api.request(urlFor('practiceSavedTasks', { courseId: this.course.id }), {
                page_ids: query.practice_question_ids,
            })
        }
        return reply
    }
}

export { StudentTasks, StudentTask, StudentTaskStep, PRACTICE };
