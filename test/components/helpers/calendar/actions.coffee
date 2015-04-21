_ = require 'underscore'
moment = require 'moment'

React = require 'react/addons'
{Promise} = require 'es6-promise'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../../../src/flux/teacher-task-plan'

{routerStub, commonActions} = require '../utilities'

actions =
  forceUpdate: (args...) ->
    {component, div} = args[0]
    routerStub.forceUpdate(component, args...)

  clickNext: commonActions.clickMatch('.next')
  clickPrevious: commonActions.clickMatch('.previous')
  clickPlan: (planId) ->
    commonActions.clickMatch(".course-plan-#{planId}")

  _getMomentWithPlans: (courseId) ->
    plansList = TeacherTaskPlanStore.getCoursePlans(courseId)

    firstPlan = _.chain(plansList)
      .clone()
      .sortBy('opens_at')
      .first()
      .value()

    moment(firstPlan.starts_at)

  _goToMonth: (testMoment, {div, courseId, component, state, router, history}) ->
    # component.refs.calendarHandler.props.startDate = testMoment
    component.refs.calendarHandler.setDate(testMoment)
    actions.forceUpdate({div, courseId, component, state, router, history})

  goToMonth: (testMoment) ->
    (args...) ->
      actions._goToMonth(testMoment, args...)

  goToMonthWithPlans: (args...) ->
    {courseId} = args[0]
    testMoment = actions._getMomentWithPlans(courseId)
    actions._goToMonth(testMoment, args...)

module.exports = actions
