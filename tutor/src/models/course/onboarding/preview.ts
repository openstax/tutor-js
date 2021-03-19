import {
    computed, observable,
} from 'mobx';

import { filter, includes, isEmpty } from 'lodash';

import BaseOnboarding from './base';
import Courses from '../../courses-map';
import UiSettings from 'shared/model/ui-settings';

import Nags from '../../../components/onboarding/nags';

const HAS_PUBLISHED = observable.box(false);
const VIEWED_PREVIEW_MESSAGE  = 'VPM';
const NAG_PLAN_TYPES = [ 'homework', 'reading' ];

export default class PreviewOnboarding extends BaseOnboarding {

    hasViewedPublishWarning() {
        HAS_PUBLISHED.set(false);
        this.dismissNag();
    }

    hasViewedDisplayPreviewMessage() {
        UiSettings.set(VIEWED_PREVIEW_MESSAGE, this.course.id, true);
    }

    dismissNag() {
        this.isDismissed = true;
    }

  @computed get shouldWarnPreviewOnly() {
        if (!HAS_PUBLISHED.get() ||
        this.hasCreatedRealCourse ||
        !this.course.offering ||
        !this.course.offering.is_available ||
      this.course.teacherTaskPlans.api.isPending
        ) { return false; }

        const plans = this.course.teacherTaskPlans.active;
        const realPlanCount = filter(
            plans, (plan) => !plan.is_preview && includes(NAG_PLAN_TYPES, plan.type)
        ).length;
        return (realPlanCount > 0 && realPlanCount % 2 === 0);
    }

  @computed get shouldDisplayPreviewMessage() {
      return Boolean(
          this.course.offering &&
        !isEmpty(this.course.offering.preview_message) &&
        !UiSettings.get(VIEWED_PREVIEW_MESSAGE, this.course.id)
      );
  }

  @computed get shouldDisplaySecondSessionNag() {
      return Boolean(
          this.course.courseIsNaggable &&
        this.course.offering &&
        this.course.offering.is_available
      );
  }

  @computed get nagComponent() {

      if (this.otherModalsAreDisplaying) { return null; }

      if (this.shouldDisplayPreviewMessage) { return Nags.displayPreviewMessage; }

      // we warn about creating assigments in a preview regardless of previous dismissals
      if (this.shouldWarnPreviewOnly)  { return Nags.previewOnlyWarning;  }

      if (this.isDismissed || this.hasCreatedRealCourse) { return null; }

      if (this.course.hasEnded)       { return Nags.expiredPreviewWarning; }

      if (this.shouldDisplaySecondSessionNag) {
          return Nags.secondSessionWarning;
      }
      return null;
  }

  @computed get hasCreatedRealCourse() {
      return !Courses.tutor.currentAndFuture.nonPreview.isEmpty;
  }

  @computed get showCreateCourseAction() {
      return !this.hasCreatedRealCourse && this.course.offering && this.course.offering.is_available;
  }

  _setTaskPlanPublish(v = true) {
      HAS_PUBLISHED.set(v);
  }
}
