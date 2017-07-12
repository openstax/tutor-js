import {
  computed, observable, action, autorun,
} from 'mobx';

import BaseOnboarding from './base';
import Nags from '../../../components/onboarding/nags';

import { UiSettings } from 'shared';

const PAY_LATER_CHOICE  = 'PL';

export default class StudentCourseOnboarding extends BaseOnboarding {

  @observable displayPayment = false;

  constructor(course, tourContext) {
    super(course, tourContext);
    this.disposeTourSilencer = autorun(() => this.tourContext.isEnabled = !this.nagComponent);
  }

  @computed get nagComponent() {
    if (this.displayPayment) { return Nags.makePayment; }
    if (!this.course.needsPayment) { return null; }
    if (this.course.userStudentRecord.mustPayImmediately) {
      return Nags.freeTrialEnded;
    }
    if (!UiSettings.get(PAY_LATER_CHOICE, this.course.id)) {
      return Nags.payNowOrLater;
    }
    return null;
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

  close() {
    super.close();
    this.disposeTourSilencer();
  }
}
