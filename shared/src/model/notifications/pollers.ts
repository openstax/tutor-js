import {
    extend, bindAll, difference, without, keys, isEmpty, values,
} from 'lodash';
import axios from 'axios';
import User from '../user';
import UiSettings from '../ui-settings';
import Time, { Duration } from "../time";

const STORAGE_KEY = 'ox-notifications';

class Poller {

    static forType(notices:any, type:string) {
        return new (POLLER_TYPES[type])(type, notices);
    }

    type: string
    url = ''
    notices: any
    interval: Duration
    lastPoll: Time
    prefsStorageKey: string
    polling: any
    _activeNotices: any

    constructor(type:string, notices: any, interval: Duration) {
        this.type = type;
        this.notices = notices;
        this.interval = new Duration(interval);
        this.lastPoll = Time.fromUnix(0);
        this.prefsStorageKey = `${STORAGE_KEY}-${this.type}`;
        bindAll(this, 'poll', 'onReply', 'onError');
        document.addEventListener('visibilitychange', this.onVisiblityChange);
    }

    onVisiblityChange = () => {
        if (this.shouldPoll) {
            this.poll();
        }
    }

    setUrl(url: string) {
        this.url = url;
        if (!this.polling) { this.startPolling(); }
    }

    destroy() {
        if (this.polling) { this.notices.windowImpl.clearInterval(this.polling); }
        document.removeEventListener('visibilitychange', this.onVisiblityChange);
        return delete this.polling;
    }

    startPolling() {
        this.polling = this.notices.windowImpl.setInterval(this.poll, this.interval.asMilliseconds());

        return this.poll();

    }

    get shouldPoll() {
        // we poll if the document is visible and a poll is due
        return this.notices.windowImpl.document.hidden !== true &&
        Time.now.isSameOrAfter(this.lastPoll.plus(this.interval));
    }

    poll() {
        if (this.shouldPoll) {
            this.lastPoll = Time.now;
            return axios.get(this.url, { withCredentials: true }).then(this.onReply).catch(this.onError);
        }
        return Promise.resolve();
    }

    onReply(_data: any) {
        // eslint-disable-next-line no-console
        console.warn('base onReply method called unnecessarily');
    }

    onError(resp: any) {
        // eslint-disable-next-line no-console
        console.warn(resp);
    }

    getActiveNotifications() {
        return values(this._activeNotices);
    }

    acknowledge(notice: any) {
        this._setObservedNoticeIds(
            this._getObservedNoticeIds().concat(notice.id)
        );
        delete this._activeNotices[notice.id];
        return this.notices.emit('change');
    }

    _setObservedNoticeIds(newIds: string[]) {
        return UiSettings.set(this.prefsStorageKey, newIds);
    }

    _getObservedNoticeIds(): string[] {
        return UiSettings.get(this.prefsStorageKey) || [];
    }

    _setActiveNotices(newActiveNotices:any, currentIds:any) {
        this._activeNotices = newActiveNotices;
        this.notices.emit('change');
        const observedIds = this._getObservedNoticeIds();

        // Prune the list of observed notice ids so it doesn't continue to fill up with old notices
        const outdatedIds = difference(observedIds, without(currentIds, ...Array.from(keys(newActiveNotices))));
        if (!isEmpty(outdatedIds)) {
            this._setObservedNoticeIds( without(observedIds, ...Array.from(outdatedIds)) );
        }
    }
}


class TutorUpdates extends Poller {
    active: any
    constructor(type: string, notices: any) {
        super(type, notices, new Duration({minutes: 5}));
        this.active = {};
    }

    onReply({ data }: any) {
        const observedIds = this._getObservedNoticeIds();
        const notices = {};
        const currentIds = [];
        for (let notice of data.notifications) {
            currentIds.push(notice.id);

            if (observedIds.indexOf(notice.id) !== -1) { continue; }
            notices[notice.id] = extend(notice, { type: this.type });
        }

        this._setActiveNotices(notices, currentIds);
        return this.notices.emit('tutor-update', data);
    }
}


class AccountsNagger extends Poller {
    constructor(type: string, notices: any) {
        super(type, notices, new Duration({days: 1}));
    // uncomment FOR DEBUGGING to get notification bar to show up
    // this.onReply({ data: { contact_infos: [ { id: -1, is_verified: false } ] } });
    }

    onReply({ data }: any) {
        User.setCurrent(data);
        const emails = {};
        for (let email of User.current().unVerfiedEmails()) {
            emails[email.id] = extend(email, { type: this.type });
        }
        return this._setActiveNotices(emails, keys(emails));
    }
}


var POLLER_TYPES = {
    tutor: TutorUpdates,
    accounts: AccountsNagger,
};

export default Poller;
