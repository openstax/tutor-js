import { BaseModel, action, observable, field, computed, modelize } from 'shared/model';
import { last } from 'lodash';
import invariant from 'invariant';
import urlFor from '../api'

export const MAX_ATTEMPTS = 50;

export default class Job extends BaseModel {
    @field jobId: string = ''

    @observable pollingId: number | string = ''
    @observable attempts = 0;
    @observable interval = 5;
    @observable maxAttempts = 30;
    @observable status = '';
    @observable progress = 0;

    constructor() {
        super();
        modelize(this);
    }

    @action.bound checkForUpdate() {
        if (this.attempts < this.maxAttempts) {
            this.attempts += 1;
            this.requestJobStatus();
        } else {
            this.stopPolling();
            this.onPollTimeout();
        }
    }

    @computed get isComplete() {
        return 'succeeded' === this.status || 'failed' === this.status;
    }

    @computed get hasFailed() {
        return Boolean(this.attempts >= this.maxAttempts || 'failed' === this.status);
    }

    // match existing API; right now these do the same but might not later
    @computed get isPolling() { return Boolean(this.pollingId);  }
    @computed get isPending() { return Boolean(this.pollingId);  }

    @computed get jobStatus() {
        if (this.isComplete) { return 'succeeded'; }
        if (this.isPending)  { return 'started';   }
        if ( this.hasFailed) { return 'failed';    }
        return 'unknown';
    }

    startPolling(job: string | null) {
        if (!job) return
        this.jobId = last(job.split('/')) as string;
        invariant((!this.pollingId || this.pollingId === 'pending'),
            'poll already in progress, cannot start polling twice!');
        invariant(this.jobId, 'job url is not set');
        this.attempts = 0;
        this.pollingId = window.setTimeout(this.checkForUpdate, this.interval * 1000);
    }

    stopPolling() {
        clearInterval(this.pollingId as number);
        this.pollingId = 0;
    }

    // overriden by child
    onPollComplete(_data: any) { }
    onPollTimeout() {}
    onPollFailure() {}

    // called by API
    @action async requestJobStatus() {
        const data = await this.api.request(urlFor('requestJobStatus', { jobId: this.jobId }))
        this.onJobUpdate(data)
    }

    onJobUpdateFailure() {
        this.stopPolling();
        this.onPollFailure();
    }

    @action onJobUpdate(data: any) {
        this.update(data);
        if (this.isComplete) {
            this.stopPolling();
            this.onPollComplete(data);
        } else {
            this.pollingId = window.setTimeout(this.checkForUpdate, this.interval * 1000);
        }
    }
}
