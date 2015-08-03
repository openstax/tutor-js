# coffeelint: disable=no_empty_functions

React = require 'react'
{CurrentUserStore}   = require '../flux/current-user'
{Invalid} = require '../components'

module.exports = (component, options = {}) ->

  RouteHandler = ->
  RouteHandler.contextTypes = { router: React.PropTypes.func }
  RouteHandler::render = ->
    {courseId} = @context.router.getCurrentParams()
    if options.requireRole and courseId
      role = CurrentUserStore.getCourseRole(courseId)
      if role is not options.requireRole
        return React.createElement(Invalid)

    React.createElement(component)


  return RouteHandler
