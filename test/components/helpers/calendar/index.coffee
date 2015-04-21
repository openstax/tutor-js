React = require 'react/addons'
{Promise} = require 'es6-promise'

actions = require './actions'
checks = require './checks'


CourseCalendar = require '../../../../src/components/course-calendar'
{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../../../src/flux/teacher-task-plan'

{routerStub, componentStub, commonActions} = require '../utilities'

tests =

  delay: 200

  container: document.createElement('div')

  unmount: ->
    React.unmountComponentAtNode(@container)
    @container = document.createElement('div')

  _renderCalendar: (courseId, plansList) ->
    div = @container
    componentStub._render(div, <CourseCalendar plansList={plansList}/>, {plansList, courseId})

  renderCalendar: (courseId) ->
    plansList = TeacherTaskPlanStore.getCoursePlans(courseId)
    @_renderCalendar(courseId, plansList)

  goToCalendar: (route, courseId) ->
    div = @container
    plansList = TeacherTaskPlanStore.getCoursePlans(courseId)
    routerStub._goTo(div, route, {stepId: id, taskId})



module.exports =
  calendarTests: tests
  calendarActions: actions
  calendarChecks: checks
