import { find } from 'lodash';
import type Course from './course'
import { observable, action } from 'mobx';
import { BaseModel, Map, getParentOf, ID, modelize, hydrateModel } from 'shared/model';
import ScoresForPeriod from './scores/period';
import urlFor from '../api';
import { PeriodPerformanceObj } from './types'

export default class Scores extends BaseModel {

    get course() { return getParentOf<Course>(this) }
    @observable periods = new Map<ID, ScoresForPeriod>();

    constructor() {
        super();
        modelize(this);
    }

    async fetch() {
        const data = await this.api.request<PeriodPerformanceObj[]>(urlFor('fetchCourseScores', { courseId: this.course.id }))
        this.onFetchComplete(data)
    }

    @action onFetchComplete(data: PeriodPerformanceObj[]) {
        data.forEach(s => this.periods.set(s.period_id, hydrateModel(ScoresForPeriod, s, this)))
    }

    getTask(taskId: ID) {
        const id = Number(taskId);
        const periods = this.periods.values();
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
