import ld from 'underscore';
import moment from 'moment';

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import { TeacherTaskPlanStore, TeacherTaskPlanActions } from '../../../../src/flux/teacher-task-plan';
import { TaskPlanStatsStore, TaskPlanStatsActions } from '../../../../src/flux/task-plan-stats';
import Courses from '../../../../src/models/courses-map';

import Add from '../../../../src/components/course-calendar/add';

const planId = '1';
let courseId = '1';
import VALID_PLAN_MODEL from '../../../../api/plans/1/stats.json';
import VALID_COURSE_MODEL from '../../../../api/user/courses/1.json';

import { routerStub, commonActions } from '../utilities';

const actions = {
  forceUpdate(...args) {
    const { component, div } = args[0];
    return routerStub.forceUpdate(component, ...Array.from(args));
  },

  clickNext: commonActions.clickMatch('.next'),
  clickPrevious: commonActions.clickMatch('.previous'),

  clickPlan(planId) {
    TaskPlanStatsActions.loaded(VALID_PLAN_MODEL, planId);
    Courses.bootstrap([VALID_COURSE_MODEL], { clear: true });
    return commonActions.clickMatch(`.course-plan-${planId}`);
  },

  clickAdd(...args) {
    const { component } = args[0];
    const addButton = React.findDOMNode(component.refs.calendarHandler.refs.addButtonGroup.refs.dropdownButton);
    return commonActions.clickDOMNode(addButton)(args[0]);
  },

  clickToday(...args) {
    const { component } = args[0];
    const currents = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--current');
    return commonActions.clickComponent(currents[0])(args[0]);
  },

  clickTomorrow(...args) {
    const { component } = args[0];
    const upcomings = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--upcoming');
    return commonActions.clickComponent(upcomings[0])(args[0]);
  },

  clickYesterday(...args) {
    const { component } = args[0];
    const pasts = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--past');
    return commonActions.clickComponent(ld.last(pasts))(args[0]);
  },

  clickAddHomework(...args) {
    const { component } = args[0];
    const addOnDayDropdown = ReactTestUtils.findRenderedComponentWithType(component, Add);
    commonActions.clickDOMNode(addOnDayDropdown.refs.homeworkLink.getDOMNode().childNodes[0])(args[0]);
    return args[0];
  },

  clickAddAssignment(...args) {
    const { div } = args[0];
    const addAssignmentButton = div.querySelector('#add-assignment');
    return commonActions.clickDOMNode(addAssignmentButton)(args[0]);
  },

  _getMomentWithPlans(courseId) {
    const plansList = TeacherTaskPlanStore.getActiveCoursePlans(courseId);

    const firstPlan = ld.chain(plansList)
      .clone()
      .sortBy('opens_at')
      .first()
      .value();

    return moment(firstPlan.starts_at);
  },

  _goToMonth(testMoment, { div, courseId, component, state, router, history }) {
    // component.refs.calendarHandler.props.startDate = testMoment
    component.refs.calendarHandler.setDate(testMoment);
    return actions.forceUpdate({ div, courseId, component, state, router, history });
  },

  goToMonth(testMoment) {
    return (...args) => actions._goToMonth(testMoment, ...Array.from(args));
  },

  goToMonthWithPlans(...args) {
    (({ courseId } = args[0]));
    const testMoment = actions._getMomentWithPlans(courseId);
    return actions._goToMonth(testMoment, ...Array.from(args));
  },
};

export default actions;
