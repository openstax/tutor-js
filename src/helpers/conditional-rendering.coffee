# coffeelint: disable=no_empty_functions

React = require 'react'
{CurrentUserStore}   = require '../flux/current-user'
{Invalid} = require '../components'

module.exports = (component, options = {}) ->

  RouteHandler = ->
  RouteHandler.contextTypes = { router: React.PropTypes.func }
  RouteHandler::render = ->
    {courseId} = @context.router.getCurrentParams()
    React.createElement(
      if options.requireRole and courseId and options.requireRole isnt CurrentUserStore.getCourseRole(courseId)
        Invalid
      else
        component
    )
  return RouteHandler
