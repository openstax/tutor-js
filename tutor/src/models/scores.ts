import { find } from 'lodash';
import { observable, action } from 'mobx';
import { BaseModel, getParentOf, ID, modelize, hydrateModel } from 'shared/model';
import urlFor from '../api';

import type { PeriodPerformanceData, Course } from '../models'
import { CourseScoresPeriod } from '../models'

export class CourseScores extends BaseModel {

    get course() { return getParentOf<Course>(this) }

    @observable periods = observable.map<ID, CourseScoresPeriod>();

    constructor() {
        super();
        modelize(this);
    }

    async fetch() {
        const data = await this.api.request<PeriodPerformanceData[]>(urlFor('fetchCourseScores', { courseId: this.course.id }))
        this.onFetchComplete(data)
    }

    @action onFetchComplete(data: PeriodPerformanceData[]) {
        data.forEach(s => this.periods.set(s.period_id, hydrateModel(CourseScoresPeriod, s, this)))
    }

    getTask(taskId: ID) {
        const id = Number(taskId);
        const periods = Array.from(this.periods.values());
        for(let p=0; p < periods.length; p+=1) {
            const period = periods[p];
            for(let i=0; i < period.students.length; i +=1 ){
                const task = find(period.students[i].data, { id });
                if (task) return task;
            }
        }
        return null;
    }
}
