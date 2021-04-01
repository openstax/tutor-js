import { observable, computed, modelize } from 'shared/model';
import moment from 'moment';
import Job from '../job';
import Map from 'shared/model/map';
import UiSettings from 'shared/model/ui-settings';
import Time from '../../models/time';
import Toasts from '../toasts';

const CURRENT = new Map();
const LAST_EXPORT = 'sce';

export default class ScoresExport extends Job {

    static forCourse(course) {
        let exp = CURRENT.get(course.id);
        if (!exp){
            exp = new ScoresExport(course);
            CURRENT.set(course.id, exp);
        }
        return exp;
    }

    @observable course;
    @observable url;

    @computed get lastExportedAt() {
        const date = UiSettings.get(LAST_EXPORT, this.course.id);
        return date ? moment(date).format('M/D/YY, h:mma') : null;
    }

    constructor(course) {
        super({ maxAttempts: 120, interval: 5 }); // every 5 seconds for max of 10 mins
        modelize(this);
        this.course = course;
    }

    onPollComplete(info) {
        UiSettings.set(LAST_EXPORT, this.course.id, Time.now.toISOString());
        Toasts.push({
            info,
            type: 'scores',
            handler: 'job',
            status: this.hasFailed ? 'failed' : 'ok',
        });
    }

    create() {
        // set this now so status updates immediately
        this.pollingId = 'pending';
    }

    onCreated({ data }) {
        this.startPolling(data.job);
    }

}
