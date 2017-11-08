React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment'
_  = require 'underscore'
componentModel = require './model'
Navigation = require '../../src/navigation/model'

BASE_CONTACT_LINK = 'http://openstax.force.com/support?l=en_US&c=Products%3AConcept_Coach&cu=1&fs=ContactUs&q='

makeContactMessage = (errors, userAgent, location) ->
  template = """Hello!
    I ran into a problem while using Concept Coach on
    #{userAgent} at #{location}.

    Here is some additional info:
    #{errors.join()}."""

makeContactURL = (errors, windowContext) ->
  userAgent = windowContext.navigator.userAgent
  location = windowContext.location.href

  q = encodeURIComponent(makeContactMessage(errors, userAgent, location))

  "#{BASE_CONTACT_LINK}#{q}"

formatError = (error) ->
  if _.isString(error)
    error
  else if _.isObject(error)
    error.message or error.code
  else
    String(error)

formattedDate = (date) ->
  moment(date).format("dddd, MMMM Do YYYY")

ERROR_HANDLERS =
  # The course's starts_at is in the future
  course_not_started: ({error, onClose, course}) ->
    title: 'Future Course'
    body:
      <p className="lead">
        This course has not yet started.
        Please try again after it starts on {formattedDate(course.starts_at)}
      </p>
    buttons: [
      <BS.Button key='ok' onClick={onClose} bsStyle='primary'>Close</BS.Button>
    ]


  # The course's ends_at has past
  course_ended: ({error, course}) ->
    navigateAction = ->
      Navigation.channel.emit('show.progress', view: 'progress')
    title: 'Past Course'
    body:
      <p className="lead">
        This course ended on {formattedDate(course.ends_at)}.
        No new activity can be performed on it, but you can still review past activity.
      </p>
    buttons: [
      <BS.Button key='ok' onClick={navigateAction} bsStyle='primary'>View Progress</BS.Button>
    ]

  # The default error dialog that's displayed when we have no idea what's going on
  default: ({errors, onHide}) ->
    title: 'Server Error encountered'
    body:
      <BS.Panel header="Error Details">
        <ul className="errors-listing">
          {for error, i in errors
            <li key={i}>{formatError(error)}</li>}
        </ul>
        <p>
          {window.navigator.userAgent}
        </p>
      </BS.Panel>

    buttons: [
      <BS.Button key='ok' onClick={onHide} bsStyle='primary'>OK</BS.Button>
    ]


# Sometimes the BE replies with this instead of a code
ERROR_HANDLERS['belongs to a course that has already ended'] = ERROR_HANDLERS.course_ended

module.exports = {

  getDialogAttributes: (errors, onHide, onClose, course) ->
    error = _.first(errors)

    dlg = ERROR_HANDLERS[error.code] or ERROR_HANDLERS.default
    dlg({errors, onHide, onClose, course})
}
