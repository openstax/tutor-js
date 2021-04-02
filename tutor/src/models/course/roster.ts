import type Course from '../course'
import { filter, groupBy } from 'lodash';
import {
    BaseModel, field, model, extendedArray, getParentOf,
} from 'shared/model';
import urlFor from '../../api'
import Teacher from './teacher';
import Student from './student';

export default class CourseRoster extends BaseModel {

    @field teach_url = '';

    get course():Course { return getParentOf(this) }

    @model(Teacher) teachers = extendedArray((teachers: Teacher[]) => ({
        get active() { return filter(teachers, t => t.is_active); },
        get dropped(){ return filter(teachers, t => !t.is_active); },
    }))

    @model(Student) students = extendedArray((students: Student[]) => ({
        get active() { return filter(students, t => t.is_active); },
        get activeByPeriod() { return groupBy(filter(students, t => t.is_active), 'period_id'); },
        get dropped(){ return filter(students, t => !t.is_active); },
    }))

    async fetch() {
        const roster = this.api.request(urlFor('fetchCourseRoster', { courseId: this.course.id }));
        this.update(roster)
    }

}
