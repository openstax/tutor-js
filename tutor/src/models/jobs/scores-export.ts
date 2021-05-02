import { observable, computed, ID, modelize, action } from 'shared/model';
import type { Course } from '../course'
import Job from '../job';
import UiSettings from 'shared/model/ui-settings';
import Time from 'shared/model/time'
import { currentToasts } from'../../models'
import urlFor from '../../api';

const CURRENT = observable.map<ID, ScoresExportJob>();
const LAST_EXPORT = 'sce';

export class ScoresExportJob extends Job {

    static forCourse(course: Course) {
        let exp = CURRENT.get(course.id);
        if (!exp){
            exp = new ScoresExportJob(course);
            CURRENT.set(course.id, exp);
        }
        return exp;
    }


    @observable course: Course;
    @observable url?: string;

    @computed get lastExportedAt() {
        const date = UiSettings.get(LAST_EXPORT, this.course.id);
        return date ? new Time(date).toFormat('M/d/yy, h:mma') : null;
    }

    constructor(course: Course) {
        super();
        modelize(this);
        this.maxAttempts = 120
        this.interval = 5
        this.course = course;
    }

    onPollComplete(info: any) {
        UiSettings.set(LAST_EXPORT, this.course.id, Time.now.toISOString());
        currentToasts.add({
            info,
            type: 'scores',
            handler: 'job',
            status: this.hasFailed ? 'failed' : 'ok',
        });

    }

    @action async create() {
        // set this now so status updates immediately
        this.pollingId = 'pending';
        const data = await this.api.request(urlFor('scoresExport', { courseId: this.course.id }))
        this.onCreated(data)
    }

    @action onCreated(data: any) {
        this.startPolling(data.job);
    }

}
