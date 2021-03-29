import { BaseModel, field, model, modelize, NEW_ID } from 'shared/model';
import DateTime from 'shared/model/date-time';
import { computed, action } from 'mobx';
import moment from 'moment';
import Time from '../time';

export default class CourseRole extends BaseModel {
    @field id = NEW_ID;
    @model(DateTime) joined_at = DateTime.unknown;
    @field type;
    @field period_id;
    @field research_identifier;
    @model('course') course;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get isStudentLike() {
        return Boolean(this.isStudent || this.isTeacherStudent);
    }

    @computed get isStudent() {
        return this.type == 'student';
    }

    @computed get isTeacherStudent() {
        return this.type == 'teacher_student';
    }

    @computed get isTeacher() {
        return this.type == 'teacher';
    }

    joinedAgo(terms = 'days') {
        return moment(Time.now).diff(this.joined_at, terms);
    }

    @action async become({ reset = true } = {}) {
        if (reset) {
            this.course.clearCachedStudentData();
        }
        this.course.current_role_id = this.id;
    }
}
