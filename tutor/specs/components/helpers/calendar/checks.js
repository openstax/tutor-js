import { last, first, each, find, filter } from 'lodash';
import camelCase from 'lodash/camelCase';

import moment from 'moment-timezone';
import twix from 'twix';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import { TeacherTaskPlanStore, TeacherTaskPlanActions } from '../../../../src/flux/teacher-task-plan';
import { TaskPlanStatsStore, TaskPlanStatsActions } from '../../../../src/flux/task-plan-stats';
import { TimeActions, TimeStore } from '../../../../src/flux/time';
import TimeHelper from '../../../../src/helpers/time';
import Courses from '../../../../src/models/courses-map';

import Add from '../../../../src/components/course-calendar/add';
import { CoursePlanDisplayEdit, CoursePlanDisplayQuickLook } from '../../../../src/components/course-calendar/plan-display';

const checks = {
  _checkAddMenu(addOnDayDropdown, router, courseId) {
    const routeQuery = { due_at: addOnDayDropdown.state.addDate.format(addOnDayDropdown.props.dateFormat) };
    const targetReadingLink = router.makeHref('createReading', { courseId }, routeQuery);
    const targetHomeworkLink = router.makeHref('createHomework', { courseId }, routeQuery);
    const targetExternalLink = router.makeHref('createExternal', { courseId }, routeQuery);
    const targetEventLink = router.makeHref('createEvent', { courseId }, routeQuery);

    expect(addOnDayDropdown.refs.readingLink.getDOMNode().childNodes[0].href).to.contain(targetReadingLink);
    expect(addOnDayDropdown.refs.homeworkLink.getDOMNode().childNodes[0].href).to.contain(targetHomeworkLink);
    expect(addOnDayDropdown.refs.externalLink.getDOMNode().childNodes[0].href).to.contain(targetExternalLink);
    return expect(addOnDayDropdown.refs.eventLink.getDOMNode().childNodes[0].href).to.contain(targetEventLink);
  },

  _doesLabelMatchMonthOf(testMoment, { div, component, state, router, history, courseId }) {
    const monthLabel = div.querySelector('.calendar-header-label');
    const monthFormat = component.refs.calendarHandler.refs.calendarHeader.props.format;

    const expectedMonthLabel = testMoment.format(monthFormat);

    expect(monthLabel).to.not.be.null;
    expect(monthLabel.innerText).toEqual(expectedMonthLabel);

    return { div, component, state, router, history, courseId };
  },

  _doesDateMatchMonthOf(testMoment, { div, component, state, router, history, courseId }) {
    const { date } = component.refs.calendarHandler.refs.calendar.props;
    const { viewingDuration } = component.refs.calendarHandler.refs.courseDurations.props;

    const firstCalBox = div.querySelector('.rc-Day');
    const firstTestDateMonthBox = testMoment.clone().startOf('month').startOf('week');
    const endTestDateMonthBox = testMoment.clone().endOf('month').endOf('week').add(1, 'millisecond');
    const testMonthBox = firstTestDateMonthBox.twix(endTestDateMonthBox);

    const isSameDay = testMoment.isSame(date, 'month');

    expect(isSameDay).toBe(true);
    expect(firstCalBox.innerText).toEqual(firstTestDateMonthBox.date().toString());
    expect(testMonthBox.equals(viewingDuration)).toBe(true);

    return { div, component, state, router, history, courseId };
  },

  _checkIsCalendarRendered({ div, component, state, router, history, courseId }) {
    expect(div.querySelector('.rc-Month')).to.not.be.null;
    return { div, component, state, router, history, courseId };
  },

  _checkIsDateToday(...args) {
    return checks.doesDateMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()), ...Array.from(args));
  },

  _checkIsLabelThisMonth(...args) {
    return checks.doesLabelMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()), ...Array.from(args));
  },

  _checkIsDateNextMonth(...args) {
    return checks.doesDateMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()).add(1, 'month'), ...Array.from(args));
  },

  _checkIsLabelNextMonth(...args) {
    return checks.doesLabelMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()).add(1, 'month'), ...Array.from(args));
  },

  _checkIsDatePreviousMonth(...args) {
    return checks.doesDateMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()).subtract(1, 'month'), ...Array.from(args));
  },

  _checkIsLabelPreviousMonth(...args) {
    return checks.doesLabelMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()).subtract(1, 'month'), ...Array.from(args));
  },

  _checkDoesViewHavePlans({ div, component, state, router, history, courseId }) {
    const { durations, viewingDuration } = component.refs.calendarHandler.refs.courseDurations.props;

    expect(durations).to.be.an('array');
    expect(div.querySelectorAll('.plan').length).to.be.above(0);

    // TODO: Commented_because_in_alpha_plans_in_the_calendar_do_not_have_ranges
    // each(durations, (plan) ->
    //   fullDuration = moment(plan.opens_at).startOf('day').twix(moment(plan.due_at).endOf('day'), {allDay: true})
    //   if fullDuration.overlaps(viewingDuration)
    //     expect(div.querySelectorAll(".course-plan-#{plan.id}").length).to.be.above(0)
    // )

    return { div, component, state, router, history, courseId };
  },

  _checkDoesAddDropDownShow({ div, component, state, router, history, courseId }) {
    expect(div.querySelector('.open .dropdown-menu')).to.not.be.null;

    return { div, component, state, router, history, courseId };
  },

  _checkDoesAddMenuLinkCorrectly({ div, component, state, router, history, courseId }) {
    React.Children.forEach(component.refs.calendarHandler.refs.addButtonGroup.refs.menu.props.children, function(link) {
      const routeName = camelCase(`create-${link.key}`);
      const expectedLink = router.makeHref(routeName, { courseId });

      return expect(link._store.props.href).toEqual(expectedLink);
    });

    return { div, component, state, router, history, courseId };
  },

  _checkIsYesterdayPast({ div, component, state, router, history, courseId }) {
    const past = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--past');
    const shouldBeYesterday = last(past);

    const isYesterday = shouldBeYesterday._reactInternalInstance._context.date
      .isSame(moment(TimeStore.getNow()).subtract(1, 'day'), 'day');
    expect(isYesterday).toBe(true);
    return { div, component, state, router, history, courseId };
  },

  _checkIsTodayCurrent({ div, component, state, router, history, courseId }) {
    const currents = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--current');
    const shouldBeToday = first(currents);

    const isToday = shouldBeToday._reactInternalInstance._context.date.isSame(moment(TimeStore.getNow()), 'day');
    expect(isToday).toBe(true);
    return { div, component, state, router, history, courseId };
  },

  _checkIsTomorrowUpcoming({ div, component, state, router, history, courseId }) {
    const upcomings = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--upcoming');
    const shouldBeTomorrow = first(upcomings);
    const isTomorrow = shouldBeTomorrow._reactInternalInstance._context.date.isSame(moment(TimeStore.getNow()).add(1, 'day'), 'day');
    expect(isTomorrow).toBe(true);
    return { div, component, state, router, history, courseId };
  },

  _checkIsYesterdayClickable({ div, component, state, router, history, courseId }) {
    const past = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--past');
    const shouldBeYesterday = last(past);
    expect(shouldBeYesterday.props.onClick).to.be.a('function');

    return { div, component, state, router, history, courseId };
  },

  _checkAddPlansWarning({ div, component, state, router, history, courseId }) {
    const addOnDayDropdown = ReactTestUtils.findRenderedComponentWithType(component, Add);
    expect(addOnDayDropdown.getDOMNode().style.display).to.not.equal('none');
    expect(addOnDayDropdown.getDOMNode().innerText).to.contain('Cannot assign');

    return { div, component, state, router, history, courseId };
  },

  _checkNoPeriodsWarning({ div, component, state, router, history, courseId }) {
    const addDropdown = ReactTestUtils.findRenderedComponentWithType(component, Add).getDOMNode();

    expect(addDropdown.style.display).to.not.equal('none');
    expect(addDropdown.innerText).to.contain('Please add')
      .and.to.contain('in \nCourse Settings before\nadding assignments.');

    return { div, component, state, router, history, courseId };
  },

  _checkNoPeriodsOnAddAssignmentWarning({ div, component, state, router, history, courseId }) {
    const addDropdown = div.querySelector('.add-assignment .dropdown-menu');

    expect(addDropdown.style.display).to.not.equal('none');
    expect(addDropdown.innerText).to.contain('Please add')
      .and.to.contain('in \nCourse Settings before\nadding assignments.');

    return { div, component, state, router, history, courseId };
  },

  _checkIsTodayClickable({ div, component, state, router, history, courseId }) {
    const currents = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--current');
    const shouldBeToday = first(currents);
    expect(shouldBeToday.props.onClick).to.be.a('function');

    return { div, component, state, router, history, courseId };
  },

  _checkIsTomorrowClickable({ div, component, state, router, history, courseId }) {
    const upcomings = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--upcoming');
    const shouldBeTomorrow = first(upcomings);
    expect(shouldBeTomorrow.props.onClick).to.be.a('function');

    return { div, component, state, router, history, courseId };
  },

  _checkTodayAddPlansDropDown({ div, component, state, router, history, courseId }) {
    const currents = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--current');
    const shouldBeToday = first(currents);
    expect(shouldBeToday.getDOMNode().classList.contains('active')).toBe(true);

    const addOnDayDropdown = ReactTestUtils.findRenderedComponentWithType(component, Add);
    expect(addOnDayDropdown.getDOMNode().style.display).to.not.equal('none');

    const isToday = addOnDayDropdown.state.addDate.isSame(moment(TimeStore.getNow()), 'day');
    // add date for drop down should be Today
    expect(isToday).toBe(true);
    checks._checkAddMenu(addOnDayDropdown, router, courseId);

    return { div, component, state, router, history, courseId };
  },

  _checkTomorrowAddPlansDropDown({ div, component, state, router, history, courseId }) {
    const upcomings = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--upcoming');
    const shouldBeTomorrow = first(upcomings);
    expect(shouldBeTomorrow.getDOMNode().classList.contains('active')).toBe(true);

    const addOnDayDropdown = ReactTestUtils.findRenderedComponentWithType(component, Add);
    expect(addOnDayDropdown.getDOMNode().style.display).to.not.equal('none');

    const isTomorrow = addOnDayDropdown.state.addDate.isSame(moment(TimeStore.getNow()).add(1, 'day'), 'day');
    // add date for drop down should be Tomorrow
    expect(isTomorrow).toBe(true);
    checks._checkAddMenu(addOnDayDropdown, router, courseId);

    return { div, component, state, router, history, courseId };
  },

  _checkIsAtHomeworkLinkAfterAddClick({ div, component, state, router, history, courseId }) {
    const addOnDayDropdown = ReactTestUtils.findRenderedComponentWithType(component, Add);

    const routeQuery = { due_at: addOnDayDropdown.state.addDate.format(addOnDayDropdown.props.dateFormat) };
    const targetHomeworkLink = router.makeHref('createHomework', { courseId }, routeQuery);
    expect(state.path).toEqual(targetHomeworkLink);
    return { div, component, state, router, history, courseId };
  },

  _checkDoesTimezoneMatchCourse({ div, component, state, router, history, courseId }) {
    expect([undefined, CourseStore.getTimezone(courseId)]).to.contain(moment().tz());

    return { div, component, state, router, history, courseId };
  },
};


// promisify for chainability in specs
each(checks, function(check, checkName) {
  // rename without _ in front
  const promiseName = checkName.slice(1);

  return checks[promiseName] = (...args) => Promise.resolve(check(...Array.from(args || [])));
});

checks._checkDoesViewShowPlan = function(planId, { div, component, state, router, history, courseId }) {
  const plansList = TeacherTaskPlanStore.getActiveCoursePlans(courseId);
  const plan = filter(plansList, { id: planId });

  return expect(document.querySelector('.modal-title').innerText).toEqual(plan.title);
};

checks.checkDoesViewShowPlan = planId =>
  (...args) => Promise.resolve(checks._checkDoesViewShowPlan(planId, ...Array.from(args)))
;

checks._checkIsEditPlanLink = function(planId, { div, component, state, router, history, courseId }) {
  const plansList = TeacherTaskPlanStore.getActiveCoursePlans(courseId);
  const plan = filter(plansList, { id: planId });

  const planEditRoute = `edit-${plan.type}`;

  const targetEditLink = router.makeHref(camelCase(planEditRoute), { courseId, id: planId });
  const planEdits = ReactTestUtils.scryRenderedComponentsWithType(component, CoursePlanDisplayEdit);
  const thisPlanEdit = find(planEdits, planEdit => planEdit.props.plan.id === planId);

  // checks that there's a link, and that the href matches
  expect(div.querySelector(`.course-plan-${planId} a`).href).to.contain(targetEditLink);
  // checks that a CoursePlanDisplayEdit component was rendered for this plan
  return expect(thisPlanEdit).to.not.be.null;
};

checks.checkIsEditPlanLink = planId =>
  (...args) => Promise.resolve(checks._checkIsEditPlanLink(planId, ...Array.from(args)))
;

checks._checkIsViewPlanElement = function(planId, { div, component, state, router, history, courseId }) {
  const planQuickLooks = ReactTestUtils.scryRenderedComponentsWithType(component, CoursePlanDisplayQuickLook);
  const thisPlanQuickLook = find(planQuickLooks, planQuickLook => planQuickLook.props.plan.id === planId);

  // checks that there's not a link.
  expect(div.querySelector(`.course-plan-${planId} a`)).toBeNull();
  // checks that a CoursePlanDisplayQuickLook component was rendered for this plan
  return expect(thisPlanQuickLook).to.not.be.null;
};

checks.checkIsViewPlanElement = planId =>
  (...args) => Promise.resolve(checks._checkIsViewPlanElement(planId, ...Array.from(args)))
;

checks._checkDoesViewShowPlanStats = function(planId, { div, component, state, router, history, courseId }) {
  const plan = TaskPlanStatsStore.get(planId);

  return expect(document.querySelector('.text-complete').innerText).toEqual(plan.stats[0].complete_count.toString());
};

checks.checkDoesViewShowPlanStats = planId =>
  (...args) => Promise.resolve(checks._checkDoesViewShowPlanStats(planId, ...Array.from(args)))
;

export default checks;
