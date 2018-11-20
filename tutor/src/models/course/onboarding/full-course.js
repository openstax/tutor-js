import {
  computed, observable,
} from 'mobx';
import { includes, isNil } from 'lodash';

import BaseOnboarding from './base';
import UiSettings from 'shared/model/ui-settings';
import Nags from '../../../components/onboarding/nags';
import User from '../../user';
import Time from '../../time';

const ONBOARDING_CHOICE = 'OBC';
const LAST_NAG_TIME = 'OBNT';
const NAG_INTERVAL = 1000 * 60 * 60 * 24 * 7; // 1 week in milliseconds

// NOTE - the strings for the key's below are meaningful and MUST
// match what's expected by the BE
// To update what's displayed to the user, see the `usageOptions` method
const CHOICES = {
  cc: 'For course credit',
  exc: 'For extra credit',
  dn: 'I dont know yet',
};

export default class FullCourseOnboarding extends BaseOnboarding {

  @observable response = false;

  @computed get nagComponent() {
    if (this.otherModalsAreDisplaying) { return null; }

    if (this.displayInitialPrompt) {
      return Nags.freshlyCreatedCourse;
    } else if (includes(['cc', 'exc'], this.response)) {
      return Nags.courseUseTips;
    } else if (this.response === 'dn') {
      return Nags.thanksForNow;
    }
    return null;
  }

  @computed get displayInitialPrompt() {
    return Boolean(
      this.response === false && // haven't selected anything
        this.courseIsNaggable && // base method, have joined at least 4 hours ago
        this.isOnboardingUndecided // haven't prompted recently and are undecided
    );
  }

  @computed get lastNaggedAgo() {
    const timestamp = UiSettings.get(LAST_NAG_TIME, this.course.id);
    if (!isNil(timestamp)) {
      return Time.now.getTime() - timestamp;
    }
    return null;
  }

  @computed get isOnboardingUndecided() {
    if (this.lastNaggedAgo && this.lastNaggedAgo < NAG_INTERVAL) { return false; }
    return includes(['dn', undefined], UiSettings.get(ONBOARDING_CHOICE, this.course.id));
  }

  recordExpectedUse(decision) {
    this.response = decision;
    UiSettings.set(ONBOARDING_CHOICE, this.course.id, decision);
    UiSettings.set(LAST_NAG_TIME, this.course.id, Time.now.getTime());

    User.logEvent({
      category: 'onboarding', code: 'made_adoption_decision',
      data: { decision: CHOICES[decision], course_id: this.course.id },
    });
  }

  get usageOptions() {
    return {
      cc: 'Required as part of the grade',
      exc: 'For extra credit',
      dn: 'I don’t know yet',
    };
  }


}
