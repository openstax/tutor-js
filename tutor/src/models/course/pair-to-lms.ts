import { BaseModel, observable, action } from 'shared/model';
import type { Course } from '../../models'
import urlFor from '../../api'

export class PairToLMS extends BaseModel {

    @observable course:Course;
    @observable success = false;

    constructor(course: Course) {
        super();
        this.course = course;
    }

    async save() {
        const reply = await this.api.request(urlFor('pairToLMS', { courseId: this.course.id }))
        this.onPaired(reply)
    }

    @action onPaired(reply: any) {
        this.success = reply.success;
    }
}
