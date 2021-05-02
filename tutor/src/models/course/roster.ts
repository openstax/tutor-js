import { filter, groupBy } from 'lodash';
import {
    BaseModel, field, model, array, getParentOf, modelize,
} from 'shared/model';
import urlFor from '../../api'
import { CourseTeacher as Teacher, CourseStudent as Student } from '../../models'
import type { Course  } from '../../models'

export class CourseRoster extends BaseModel {

    @field teach_url = '';

    constructor() {
        super()
        modelize(this);
    }

    get course() { return getParentOf<Course>(this) }

    @model(Teacher) teachers = array((teachers: Teacher[]) => ({
        get active() { return filter(teachers, t => t.is_active); },
        get dropped(){ return filter(teachers, t => !t.is_active); },
    }))

    @model(Student) students = array((students: Student[]) => ({
        get active() { return filter(students, t => t.is_active); },
        get activeByPeriod() { return groupBy(filter(students, t => t.is_active), 'period_id'); },
        get dropped(){ return filter(students, t => !t.is_active); },
    }))

    async fetch() {
        const roster = await this.api.request(urlFor('fetchCourseRoster', { courseId: this.course.id }));
        this.update(roster)
    }

}
