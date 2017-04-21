React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
isEmpty = require 'lodash/isEmpty'
isObject = require 'lodash/isObject'

Dialog      = require '../tutor-dialog'
TutorRouter = require '../../helpers/router'
TimeHelper  = require '../../helpers/time'
ServerErrorMessage = require './server-error-message'

{AppStore}    = require '../../flux/app'
{CourseStore} = require '../../flux/course'
UserMenu = require('../../models/user/menu').default

goToDashboard = (context, courseId) ->
  context.router.transitionTo(
    TutorRouter.makePathname('dashboard', {courseId})
  )
  Dialog.hide()

getCurrentCourse = ->
  {courseId} = TutorRouter.currentParams()
  if courseId then CourseStore.get(courseId) else {}

reloadOnce = ->
  navigation = AppStore.errorNavigation()
  return if isEmpty navigation
  if navigation.shouldReload
    join = if window.location.search then '&' else '?'
    window.location.href = window.location.href + join + 'reloaded'
  else if navigation.href
    window.location.href = navigation.href


ERROR_HANDLERS =
  # The course's starts_at is in the future
  course_not_started: (error, message, context) ->
    course = getCurrentCourse()
    navigateAction = partial(goToDashboard, context, course.id)
    title: 'Future Course'
    body:
      <p className="lead">
        This course has not yet started.
        Please try again after it starts on {TimeHelper.toHumanDate(course.starts_at)}
      </p>
    buttons: [
      <BS.Button key='ok' onClick={navigateAction} bsStyle='primary'>OK</BS.Button>
    ]
    onOk: navigateAction
    onCancel: navigateAction

  # The course's ends_at has past
  course_ended: (error, message, context) ->
    course = getCurrentCourse()
    navigateAction = partial(goToDashboard, context, course.id)
    title: 'Past Course'
    body:
      <p className="lead">
        This course ended on {TimeHelper.toHumanDate(course.ends_at)}.
        No new activity can be peformed on it, but you can still review past activity.
      </p>
    buttons: [
      <BS.Button key='ok' onClick={navigateAction} bsStyle='primary'>OK</BS.Button>
    ]
    onOk: navigateAction
    onCancel: navigateAction


  # No exercises were found, usually for personalized practice
  no_exercises: (error, message, context) ->
    navigateAction = partial(goToDashboard, context, getCurrentCourse().id)
    title: 'No exercises are available'
    body:
      <div className="no-exercises">
        <p className="lead">There are no problems to show for this topic.</p>
      </div>
    buttons: [
      <BS.Button key='ok' onClick={navigateAction} bsStyle='primary'>OK</BS.Button>
    ]
    onOk: navigateAction
    onCancel: navigateAction

  # The default error dialog that's displayed when we have no idea what's going on
  default: (error, message, context = {}) ->
    unless error.supportLinkBase?
      {courseId} = context
      error.supportLinkBase = UserMenu.helpLinkForCourseId(courseId)
    title: 'Server Error'
    body: <ServerErrorMessage {...error}/>
    buttons: [
      <BS.Button key='ok' onClick={-> Dialog.hide()} bsStyle='primary'>OK</BS.Button>
    ]
    onOk: reloadOnce
    onCancel: reloadOnce


module.exports = {
  defaultAttributes: ({error, data, context}) ->
    ERROR_HANDLERS.default(error, data, context)

  getAttributesForCode: (code, {error, data, context}) ->
    handler = ERROR_HANDLERS[code] or ERROR_HANDLERS.default
    handler(error, data, context)

  forError: (error, context) ->
    handlerArgs = {error, data: error.data, context}
    if isObject(handlerArgs.data) and handlerArgs.data.errors?.length is 1
      attrs = @getAttributesForCode(
        handlerArgs.data.errors[0].code, handlerArgs
      )
    attrs or @defaultAttributes(handlerArgs)

}
