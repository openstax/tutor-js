import { identifiedBy, session, modelize } from 'shared/model';
import { isEmpty } from 'lodash';
import moment from 'moment';
import Map from 'shared/model/map';
import UiSettings from 'shared/model/ui-settings';
import { observable, computed, action } from 'mobx';
import Time from '../../models/time';
import Toasts from '../toasts';

import Job from '../job';

const CURRENT = new Map();
const LAST_PUSH = 'sclp';

@identifiedBy('jobs/lms-score-push')
export default class LmsScorePush extends Job {

    static forCourse(course) {
        let exp = CURRENT.get(course.id);
        if (!exp){
            exp = new LmsScorePush(course);
            CURRENT.set(course.id, exp);
        }
        return exp;
    }

  @observable course;
  @session url;

  constructor(course) {
      super({ maxAttempts: 180, interval: 5 }); // every 5 seconds for max of 15 mins
      modelize(this);
      this.course = course;
  }

  @computed get lastPushedAt() {
      const date = UiSettings.get(LAST_PUSH, this.course.id);
      return date ? moment(date).format('M/D/YY, h:mma') : null;
  }

  onPollComplete(info) {
      UiSettings.set(LAST_PUSH, this.course.id, Time.now.toISOString());
      const succeeded = Boolean(
          !this.hasFailed &&
        info.data.num_callbacks &&
        isEmpty(info.errors)
      );
      Toasts.push({
          info,
          type: 'lms',
          handler: 'job',
          status: succeeded ? 'ok' : 'failed',
          errors: info.errors,
      });
  }

  @action start() {
      // set this now so status updates immediately
      this.pollingId = 'pending';
  }

  @action onStarted({ data }) {
      this.startPolling(data.job);
  }

}
