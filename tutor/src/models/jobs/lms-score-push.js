import {
  identifiedBy, session,
} from '../base';

import moment from 'moment';
import { UiSettings } from 'shared';
import { TimeStore } from '../../flux/time';
import { merge, extend } from 'lodash';
import { action, observable, when, computed, box } from 'mobx';

import Job from '../job';

const CURRENT = observable.map();
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
    this.course = course;
  }

  @computed get lastPushedAt() {
    const date = UiSettings.set(LAST_PUSH, this.course.id);
    return date ? moment(date).format('M/D/YY, h:mma') : 'Never';
  }

  onPollComplete() {
    UiSettings.set(LAST_PUSH, this.course.id, TimeStore.getNow().toISOString());
  }


  start() { }

  onStarted({ data }) {
    this.startPolling(data.job);
  }

}
