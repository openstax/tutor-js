# coffeelint: disable=no_empty_functions

React = require 'react'
{CurrentUserStore}   = require '../flux/current-user'
{Invalid} = require '../components'
NoPeriods = require '../components/no-periods'
{CourseStore} = require '../flux/course'

module.exports = (component, options = {}) ->

  RouteHandler = ->
  RouteHandler.contextTypes = { router: React.PropTypes.func }
  RouteHandler::render = ->
    {courseId} = @context.router.getCurrentParams()
    course = CourseStore.get(courseId)
    React.createElement(
      if options.requireRole and courseId and options.requireRole isnt CurrentUserStore.getCourseRole(courseId)
        Invalid
      else if options.requirePeriods and course.periods.length is 0
        NoPeriods
      else
        component
    )
  return RouteHandler
