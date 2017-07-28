import {
  computed, observable, action,
} from 'mobx';

import BaseOnboarding from './base';
import Nags from '../../../components/onboarding/nags';
import Payments from '../../payments';
import { UiSettings } from 'shared';
import { get } from 'lodash';

const PAY_LATER_CHOICE  = 'PL';
const TRIAL_ACKNOWLEDGED = 'FTA';

export default class StudentCourseOnboarding extends BaseOnboarding {

  @observable displayPayment = false;

  get nagComponent() {
    if (this.displayPayment) { return Nags.makePayment; }
    if (!Payments.config.is_enabled && this.course.does_cost){
      if (!UiSettings.get(TRIAL_ACKNOWLEDGED, this.course.id)) {
        return Nags.payDisabled;
      }
    } else if (this.course.needsPayment) {
      if (this.course.userStudentRecord.mustPayImmediately) {
        return Nags.freeTrialEnded;
      } else if (!UiSettings.get(PAY_LATER_CHOICE, this.course.id)) {
        return Nags.payNowOrLater;
      }
    }

    return null;
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
  payLater() {
    UiSettings.set(PAY_LATER_CHOICE, this.course.id, true);
    this.displayPayment = false;
  }

  @action.bound
  onPaymentComplete() {
    this.displayPayment = false;
    this.course.userStudentRecord.markPaid();
  }

  mount() {
    super.mount();
    this.tourContext.otherModal = this;
  }

  close() {
    super.close();
    this.tourContext.otherModal = null;
  }

}
