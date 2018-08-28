import {
  computed, observable, action,
} from 'mobx';
import { get } from 'lodash';
import UiSettings from 'shared/model/ui-settings';
import BaseOnboarding from './base';
import Nags from '../../../components/onboarding/nags';
import Payments from '../../payments';
import User from '../../user';

const PAY_LATER_CHOICE  = 'PL';
const TRIAL_ACKNOWLEDGED = 'FTA';
const INITIAL_LOADING_DELAY = 10;
const FETCH_INITIAL_TASKS_INTERVAL = 1000 * 60 * INITIAL_LOADING_DELAY; // every X minutes;
const REFRESH_TASKS_INTERVAL = 1000 * 60 * 60 * 4; // every 4 hours

export default class StudentCourseOnboarding extends BaseOnboarding {

  @observable displayPayment = false;
  @observable displayTrialActive = false;
  @observable refreshTasksTimer = null;

  @computed get nagComponent() {
    if (this.needsTermsSigned) { return null; }

    if (this.displayPayment) { return Nags.makePayment; }
    if (!Payments.config.is_enabled && this.course.does_cost){
      if (!UiSettings.get(TRIAL_ACKNOWLEDGED, this.course.id)) {
        return Nags.payDisabled;
      }
    } else if (this.course.needsPayment) {
      if (this.course.userStudentRecord.mustPayImmediately) {
        return Nags.freeTrialEnded;
      } else if (this.displayTrialActive) {
        return Nags.freeTrialActivated;
      } else if (!UiSettings.get(PAY_LATER_CHOICE, this.course.id)) {
        return Nags.payNowOrLater;
      }
    }

    return null;
  }

  @computed get needsTermsSigned() {
    return Boolean(User.terms_signatures_needed && !this.paymentIsPastDue);
  }

  @computed get isDisplaying() {
    return Boolean(this.nagComponent);
  }

  @computed get paymentIsPastDue() {
    return get(this.course, 'userStudentRecord.mustPayImmediately', false);
  }

  @action.bound
  acknowledgeTrial() {
    UiSettings.set(TRIAL_ACKNOWLEDGED, this.course.id, true);
  }

  @action.bound
  payNow() {
    this.displayPayment = true;
  }

  @action.bound
  onAccessCourse() {
    this.displayTrialActive = false;
  }

  @action.bound
  onPayLater() {
    UiSettings.set(PAY_LATER_CHOICE, this.course.id, true);
    this.displayTrialActive = true;
    this.displayPayment = false;
  }

  @action.bound
  onPaymentComplete() {
    this.displayPayment = false;
    this.course.userStudentRecord.markPaid();
    // fetch tasks since they could not be fetched while student was in unpaid status
    if (!this.refreshTasksTimer) {
      return this.fetchTaskPeriodically();
    }
    return Promise.resolve();
  }

  @computed get isEmptyNewStudent() {
    return Boolean(
      this.course.studentTasks.expecting_assignments_count &&
        this.course.primaryRole.joinedAgo('minutes') < 10
    );
  }

  @computed get fetchTasksInterval() {
    if (this.isEmptyNewStudent) {
      return FETCH_INITIAL_TASKS_INTERVAL - this.course.primaryRole.joinedAgo('ms');
    }
    return REFRESH_TASKS_INTERVAL;
  }

  @action.bound fetchTaskPeriodically() {
    return this.course.studentTasks.fetch().then(() => {
      this.refreshTasksTimer = setTimeout(this.fetchTaskPeriodically, this.fetchTasksInterval);
    });
  }

  mount() {
    super.mount();
    if (!this.refreshTasksTimer && !this.paymentIsPastDue) {
      this.fetchTaskPeriodically();
    }
    this.tourContext.otherModal = this;
  }

  close() {
    super.close();
    if (this.refreshTasksTimer) {
      clearInterval(this.refreshTasksTimer);
      this.refreshTasksTimer = null;
    }
    this.tourContext.otherModal = null;
  }

}
