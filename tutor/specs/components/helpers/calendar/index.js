import React from 'react';

import actions from './actions';
import checks from './checks';


import CourseCalendar from '../../../../src/components/course-calendar';
import { TeacherTaskPlanStore, TeacherTaskPlanActions } from '../../../../src/flux/teacher-task-plan';

import { routerStub, componentStub, commonActions } from '../utilities';

const tests = {
  delay: 200,
  container: document.createElement('div'),

  unmount() {
    React.unmountComponentAtNode(this.container);
    return this.container = document.createElement('div');
  },

  _renderCalendar(courseId, plansList) {
    const div = this.container;
    return componentStub._render(div, <CourseCalendar plansList={plansList} />, { plansList, courseId });
  },

  renderCalendar(courseId) {
    const plansList = TeacherTaskPlanStore.getActiveCoursePlans(courseId);
    return this._renderCalendar(courseId, plansList);
  },

  goToCalendar(route, courseId) {
    const div = this.container;
    return routerStub._goTo(div, route, { courseId });
  },
};


export { tests as calendarTests, actions as calendarActions, checks as calendarChecks };
