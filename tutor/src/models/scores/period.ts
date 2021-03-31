import { find, filter } from 'lodash';
import { computed } from 'mobx';
import type CourseScores from '../scores'
//import type TaskResult from './task-result'
import Bignum from 'shared/model/bignum'
import { BaseModel, field, model, modelize, NEW_ID, extendedArray, getParentOf } from 'shared/model';
import Heading from './heading';
import Student from './student';

export default class CourseScoresPeriod extends BaseModel {

    @model(Bignum) overall_course_average = Bignum.unknown;
    @model(Bignum) overall_reading_score = Bignum.unknown;
    @model(Bignum) overall_reading_progress = Bignum.unknown;
    @model(Bignum) overall_homework_score = Bignum.unknown;
    @model(Bignum) overall_homework_progress = Bignum.unknown;

    @field period_id = NEW_ID;
    @model(Heading) data_headings: Heading[] = [];

    @model(Student) students = extendedArray({
        active() { return filter(this, 'isActive'); },
    })

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

    // @action adjustScores(triggeringTask: TaskResult) {
    //     this[`overall_${triggeringTask.type}_progress`] = this.averageForType(
    //         `${triggeringTask.type}_progress`,
    //     );
    //     this[`overall_${triggeringTask.type}_score`] = this.averageForType(
    //         `${triggeringTask.type}_score`,
    //     );

    //     const { course } = this;

    //     if (
    //         !((course.homework_score_weight && !this.overall_homework_score) ||
    //             (course.homework_progress_weight && !this.overall_homework_progress) ||
    //             (course.reading_score_weight && !this.overall_reading_score) ||
    //             (course.reading_progress_weight && !this.overall_reading_progress)
    //          )
    //     ) {
    //         this.overall_course_average =
    //             Big(course.homework_score_weight).times(this.overall_homework_score || 0)
    //                 .plus(
    //                     Big(course.homework_progress_weight).times(this.overall_homework_progress || 0)
    //                 )
    //                 .plus(
    //                     Big(course.reading_score_weight).times(this.overall_reading_score || 0)
    //                 )
    //                 .plus(
    //                     Big(course.reading_progress_weight).times(this.overall_reading_progress || 0)
    //                 );
    //     }
    // }

    // averageForType(attr) {
    //     const students = this.students.active();
    //     if (isEmpty(students)) { return null; }

    //     return reduce(students,
    //                   (acc, s) => acc.plus(s[attr] || 0),
    //                   new Big(0)
    //                  ).div(students.length);
    // }

}
