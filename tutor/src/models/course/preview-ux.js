import {
  computed, observable,
} from 'mobx';

import BasicCourseUX from './basic-ux';
import Courses from '../courses-map';
import { filter, find } from 'lodash';

import TeacherTaskPlans from '../teacher-task-plans';

import Nags from '../../components/course-preview/nags';


export default class CoursePreviewUX extends BasicCourseUX {

  @observable isDismissed = false;

  @computed get shouldWarnPreviewOnly() {
    const plans = TeacherTaskPlans.forCourseId(this.course.id).active;
    const realPlanCount = filter(plans, { is_preview: false }).length;
    return (realPlanCount > 0 && realPlanCount % 2 === 0);
  }


  @computed get nagComponent() {
    if (this.isDismissed || this.hasCreatedRealCourse) { return null; }

    if (this.course.hasEnded)                { return Nags.expiredPreviewWarning; }
    if (this.shouldWarnPreviewOnly)          { return Nags.previewOnlyWarning;    }
    if (this.course.dashboardViewCount == 2) { return Nags.secondSessionWarning;  }
    return null;
  }

  @computed get hasCreatedRealCourse() {
    return !!find(Courses.array, { is_preview: false });
  }

  @computed get showCreateCourseAction() {
    return !this.hasCreatedRealCourse;
  }

}
