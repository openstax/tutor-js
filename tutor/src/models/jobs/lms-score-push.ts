import { observable, computed, action, modelize, ID } from 'shared/model';
import { isEmpty } from 'lodash';
import type Course from '../course'
import UiSettings from 'shared/model/ui-settings';
import Time from 'shared/model/time'
import Toasts from '../toasts';

import Job from '../job';
import urlFor from '../../api';


const CURRENT = observable.map<ID, LmsScorePush>();
const LAST_PUSH = 'sclp';

export default class LmsScorePush extends Job {

    static forCourse(course: Course) {
        let exp = CURRENT.get(course.id);
        if (!exp){
            exp = new LmsScorePush(course);
            CURRENT.set(course.id, exp);
        }
        return exp;
    }

    @observable course: Course;
    @observable url?: string;

    constructor(course: Course) {
        super();
        modelize(this);
        this.maxAttempts = 180
        this.interval = 5
        this.course = course;
    }

    @computed get lastPushedAt() {
        const date = UiSettings.get(LAST_PUSH, this.course.id);
        return date ? new Time(date).toFormat('M/d/yy, h:mma') : null;
    }

    onPollComplete(info: any) {
        UiSettings.set(LAST_PUSH, this.course.id, Time.now.toISOString());
        const succeeded = Boolean(
            !this.hasFailed &&
        info.data.num_callbacks &&
        isEmpty(info.errors)
        );
        Toasts.add({
            info,
            type: 'lms',
            handler: 'job',
            status: succeeded ? 'ok' : 'failed',
            errors: info.errors,
        });
    }

    @action async start() {
        // set this now so status updates immediately
        this.pollingId = 'pending';
        const { job } = await this.api.request(urlFor('pushLmsScores', { courseId: this.course.id }))
        this.onStarted(job)
    }

    @action onStarted(job: string) {
        this.startPolling(job);
    }

}
