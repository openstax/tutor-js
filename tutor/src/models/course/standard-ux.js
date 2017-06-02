import {
  computed, observable,
} from 'mobx';
import { includes } from 'lodash';

import BasicCourseUX from './basic-ux';
import Nags from '../../components/onboarding/nags';
import User from '../user';
import { UiSettings } from 'shared';
const ONBOARDING_CHOICE = 'OBC';

// NOTE - the strings for the key's below are meaningful and MUST match what's expected by the BE
const CHOICES = {
  cc: 'For course credit',
  exc: 'For extra credit',
  adr: 'As an additional resource',
  dn: 'I don\'t know yet',
  wu: 'I won\'t be using it',
};

export default class StandardCourseUX extends BasicCourseUX {

  @observable response = false;

  @computed get nagComponent() {
    if (this.response === false && (
      this.course.dashboardViewCount == 2 || this.isOnboardingUndecided
    )) {
      return Nags.freshlyCreatedCourse;
    } else if (includes(['cc', 'exc', 'adr'], this.response)) {
      return Nags.courseUseTips;
    } else if (this.response === 'dn') {
      return Nags.thanksForNow;
    } else if (this.response === 'wu') {
      return Nags.thanksAnways;
    }
    return null;
  }

  @computed get isOnboardingUndecided() {
    return UiSettings.get(ONBOARDING_CHOICE, this.course.id) === 'dn';
  }


  recordExpectedUse(decision) {
    this.response = decision;
    UiSettings.set(ONBOARDING_CHOICE, this.course.id, decision);

    User.logEvent({
      category: 'onboarding', code: 'made_adoption_decision',
      data: { decision: CHOICES[decision] },
    });
  }

  get usageOptions() {
    return {
      cc: 'Required for some course credit',
      exc: 'For extra credit',
      adr: 'As an additional resource',
      dn: 'I don’t know yet',
      wu: 'I won’t be using it',
    };
  }


}
