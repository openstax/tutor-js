import { find, filter } from 'lodash';
import { computed } from 'mobx';
//import type TaskResult from './task-result'
import Bignum from 'shared/model/bignum'
import { BaseModel, field, model, modelize, array, NEW_ID, getParentOf } from 'shared/model';
//import Heading from './heading';
// import Student from './student';
import type { CourseScores } from '../../models'
import { CourseScoresStudent as Student, CourseScoresHeading as Heading } from '../../models'

export class CourseScoresPeriod extends BaseModel {
    // id is needed to make mapable
    get id(){ return this.period_id }
    @model(Bignum) overall_course_average = Bignum.unknown;
    @model(Bignum) overall_reading_score = Bignum.unknown;
    @model(Bignum) overall_reading_progress = Bignum.unknown;
    @model(Bignum) overall_homework_score = Bignum.unknown;
    @model(Bignum) overall_homework_progress = Bignum.unknown;

    @field period_id = NEW_ID;
    @model(Heading) data_headings = array<Heading>()

    @model(Student) students = array((students: Student[]) => ({
        get active() { return filter(students, 'isActive'); },
    }))

    get courseScores():CourseScores { return getParentOf(this) }
    get course() { return this.courseScores.course }

    constructor() {
        super()
        modelize(this);
    }

    @computed get courseStudents() {
        return this.course.roster.students.activeByPeriod[this.period_id] || [];
    }

    @computed get numAssignments() {
        return this.data_headings.length;
    }

    @computed get coursePeriod() {
        return find(this.course.periods, { id: this.period_id });
    }
}
