import {
  computed, observable,
} from 'mobx';

import BasicCourseUX from './basic-ux';
import Courses from '../courses-map';
import { filter, find, includes } from 'lodash';
import User from '../user';
import TeacherTaskPlans from '../teacher-task-plans';
import { TaskPlanStore } from '../../flux/task-plan';

import Nags from '../../components/course-preview/nags';

const IS_DISMISSED = observable.box(false);
const HAS_PUBLISHED = observable.box(false);
TaskPlanStore.on('publish-queued', () => HAS_PUBLISHED.set(true));

const NAG_PLAN_TYPES = [ 'homework', 'reading' ];

export default class CoursePreviewUX extends BasicCourseUX {

  hasViewedPublishWarning() {
    HAS_PUBLISHED.set(false);
    IS_DISMISSED.set(true);
  }

  dismissNag() {
    IS_DISMISSED.set(true);
  }

  @computed get shouldWarnPreviewOnly() {
    if (!HAS_PUBLISHED.get() ||
        this.hasCreatedRealCourse ||
        TeacherTaskPlans.hasApiRequestPending
       ) { return false; }

    const plans = TeacherTaskPlans.forCourseId(this.course.id).active;
    const realPlanCount = filter(
      plans, (plan) => !plan.is_preview && includes(NAG_PLAN_TYPES, plan.type)
    ).length;
    return (realPlanCount > 0 && realPlanCount % 2 === 0);
  }

  @computed get nagComponent() {
    // we warn about creating assigments in a preview regardless of previous dismissals
    if (this.shouldWarnPreviewOnly)  { return Nags.previewOnlyWarning;  }

    if (IS_DISMISSED.get() || this.hasCreatedRealCourse) { return null; }

    if (this.course.hasEnded)       { return Nags.expiredPreviewWarning; }
    if (User.sessionCount > 2)      { return Nags.secondSessionWarning;  }
    return null;
  }

  @computed get hasCreatedRealCourse() {
    return !Courses.tutor.currentAndFuture.nonPreview.isEmpty;
  }

  @computed get showCreateCourseAction() {
    return !this.hasCreatedRealCourse;
  }

  _setTaskPlanPublish(v = true) {
    HAS_PUBLISHED.set(v);
  }
}
