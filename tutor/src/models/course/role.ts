import type Course from '../course'
import { BaseModel, field, model, modelize, getParentOf, NEW_ID } from 'shared/model';
import DateTime, { DurationUnit } from 'shared/model/date-time';
import { computed, action } from 'mobx';

export default class CourseRole extends BaseModel {
    @field id = NEW_ID;
    @model(DateTime) joined_at = DateTime.unknown;
    @field type = '';
    @field period_id = NEW_ID;
    @field research_identifier = '';

    get course(): Course { return  getParentOf(this); }

    constructor() {
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

    joinedAgo(terms: DurationUnit = 'days') {
        return this.joined_at.distanceToNow(terms) * -1;
    }

    @action async become({ reset = true } = {}) {
        if (reset) {
            this.course.clearCachedStudentData();
        }
        this.course.current_role_id = this.id;
    }
}
