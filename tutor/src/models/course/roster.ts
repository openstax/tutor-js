import type Course from '../course'
import { filter, groupBy } from 'lodash';
import {
    BaseModel, field, model, extendedArray, getParentOf,
} from 'shared/model';
import Api from '../../api'
import Teacher from './teacher';
import Student from './student';

export default class CourseRoster extends BaseModel {

    @field teach_url = '';

    get course():Course { return getParentOf(this) }

    @model(Teacher) teachers = extendedArray<Teacher>({
        get active() { return filter(this, t => t.is_active); },
        get dropped(){ return filter(this, t => !t.is_active); },
    });

    @model(Student) students = extendedArray<Student>({
        get active() { return filter(this, t => t.is_active); },
        get activeByPeriod() { return groupBy(filter(this, t => t.is_active), 'period_id'); },
        get dropped(){ return filter(this, t => !t.is_active); },
    })

    async fetch() {
        const roster = this.api.request(Api.fetchCourseRoster({ courseId: this.course.id }));

    }

}
