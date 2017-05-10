import {
  computed, observable,
} from 'mobx';

import BasicCourseUX from './basic-ux';
import Courses from '../courses-map';
import { filter, find } from 'lodash';

import TeacherTaskPlans from '../teacher-task-plans';

import Nags from '../../components/course-preview/nags';


export default class CoursePreviewUX extends BasicCourseUX {

  @computed get shouldWarnPreviewOnly() {
    const plans = TeacherTaskPlans.forCourseId(this.course.id).active;
    const previewPlans = filter(plans, { is_preview: true });
    const realPlanCount = plans.length - previewPlans.length;
    // we should warn after every 2nd plan that's created;
    return (realPlanCount > 0 && realPlanCount % 2 === 0);
  }

  @observable isDismissed;

  @computed get nagComponent() {
    if (this.isDismissed || this.hasCreatedRealCourse) { return null; }

    if (this.shouldWarnPreviewOnly) {
      return Nags.previewOnlyWarning;
    } if (this.course.dashboardViewCount == 2) {
      return Nags.secondSessionWarning;
    }
    return null;
  }

  @computed get hasCreatedRealCourse() {
    return !!find(Courses.array, { is_preview: false });
  }

  @computed get showCreateCourseAction() {
    return !this.hasCreatedRealCourse;
  }

}
