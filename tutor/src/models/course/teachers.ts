import Map, { ID, modelize, getParentOf } from 'shared/model/map';
import { sortBy } from 'lodash'
import urlFor from '../../api'
import { Course, CourseTeacher, currentUser } from '../../models'

export class CourseTeachers extends Map<ID, CourseTeacher> {
    static Model = CourseTeacher

    constructor() {
        super()
        modelize(this);
    }

    get course() { return getParentOf<Course>(this) }

    get sorted() { return sortBy(this.values(), 'name') }

    get current() { return this.get(currentUser.profile_id) }

    get notCurrent() { return this.where((t) => t.profile_id !== String(currentUser.profile_id)) }

    async fetch() {
        const items = await this.api.request(urlFor('fetchCourseTeachers', { courseId: this.course.id }))
        this.mergeModelData(items)
    }
}
