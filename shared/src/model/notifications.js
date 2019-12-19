import EventEmitter2 from 'eventemitter2';
import moment from 'moment';

import remove from 'lodash/remove';
import cloneDeep from 'lodash/cloneDeep';
import reject from 'lodash/reject';
import find from 'lodash/find';
import defaults from 'lodash/defaults';
import uniqueId from 'lodash/uniqueId';
import without from 'lodash/without';
import extend from 'lodash/extend';
import isEmpty from 'lodash/isEmpty';
import isMatch from 'lodash/isMatch';
import { observable } from 'mobx';
import Poller from './notifications/pollers';

import URLs from './urls';
const EVENT_BUS = new EventEmitter2;
let POLLERS = {};

let NOTICES = observable.array([]);

let HIDDEN = observable.array([]);

const CLIENT_ID = 'client-specified';
//const Poller = require('./notifications/pollers');

const Notifications = {
  POLLING_TYPES: {
    MISSING_STUDENT_ID: 'missing_student_id',
    COURSE_HAS_ENDED: 'course_has_ended',
  },

  // for use by specs, not to be considered "public"
  _reset() {
    this.stopPolling();
    return NOTICES = [];
  },

  display(notice) {
    // fill in an id and type if not provided
    notice = defaults(cloneDeep(notice), { id: uniqueId(CLIENT_ID), type: CLIENT_ID });
    if (!find(NOTICES, { id: notice.id })) { NOTICES.push(notice); }
    return this.emit('change');
  },

  _startPolling(type, url) {
    if (!POLLERS[type]) { POLLERS[type] = Poller.forType(this, type); }
    return POLLERS[type].setUrl(url);
  },

  startPolling(windowImpl = window) {
    this.windowImpl = windowImpl;
    if (URLs.get('accounts_api')) { this._startPolling(
      'accounts', URLs.construct('accounts_api', 'user')
    ); }

    if (URLs.get('tutor_api')) { this._startPolling(
      'tutor', URLs.construct('tutor_api', 'updates')
    ); }
  },

  acknowledge(notice) {
    const poller = POLLERS[notice.type];
    if (poller) { // let the poller decide what to do
      return poller.acknowledge(notice);
    } else {
      NOTICES = without(NOTICES, find(NOTICES, { id: notice.id }));
      return this.emit('change');
    }
  },

  hide(notice) {
    HIDDEN.push(notice);
    return this.emit('change');
  },

  removeType(type) {
    remove(NOTICES, { type });
    return this.emit('change');
  },

  unhide(notice) {
    HIDDEN = reject(HIDDEN, notice);
    return this.emit('change');
  },

  rejectHidden(notices) {
    return reject(notices, notice =>
      find(HIDDEN, hidden => isMatch(notice, hidden))
    );
  },

  // Notices originate via multiple methods.
  // * Pollers periodically check verious network endpoints
  // * Generated when the `setCourseRole` method is called
  //   based on the user's relationship with the course
  // The `getActive` method is the single point for checking which notifications
  // should be displayed
  getActive() {
    const active = cloneDeep(this.rejectHidden(NOTICES));
    for (let type in POLLERS) {
      const poller = POLLERS[type];
      for (let notice of this.rejectHidden(poller.getActiveNotifications())) { active.push(cloneDeep(notice)); }
    }
    return active;
  },

  stopPolling() {
    for (let type in POLLERS) { const poller = POLLERS[type]; poller.destroy(); }
    return POLLERS = {};
  },

  // Called when the current course and/or role has changed
  // The notification logic may display a notice
  // based on the relationship or if student identifier is missing
  setCourseRole(course, role) {
    let id;
    if (isEmpty(role) || (role.type === 'teacher')) { return; }
    const studentId = __guard__(find(course.students, { role_id: role.id }), x => x.student_identifier);
    if (isEmpty(studentId) && (moment().diff(role.joined_at, 'days') > 7)) {
      id = this.POLLING_TYPES.MISSING_STUDENT_ID;
      this.display({ id, type: id, course, role });
    } else {
      this.removeType(this.POLLING_TYPES.MISSING_STUDENT_ID);
    }
    if (moment(course.ends_at).isBefore(moment(), 'day')) {
      id = this.POLLING_TYPES.COURSE_HAS_ENDED;
      this.display({ id, type: id, course, role });
    } else {
      this.removeType(this.POLLING_TYPES.COURSE_HAS_ENDED);
    }
  },
};

// mixin event emitter methods, particulary it's 'on' and 'off'
// since they're compatible with Tutor's bindstore mixin
extend(Notifications, EVENT_BUS);

export default Notifications;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
