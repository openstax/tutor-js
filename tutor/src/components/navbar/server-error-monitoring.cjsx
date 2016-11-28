React = require 'react'
BindStoreMixin = require '../bind-store-mixin'
BS = require 'react-bootstrap'
_  = require 'underscore'

{AppStore, AppActions} = require '../../flux/app'
{CurrentUserStore} = require '../../flux/current-user'

Dialog = require '../tutor-dialog'
ServerErrorMessage = require '../server-error-message'

reloadOnce = ->
  navigation = AppStore.errorNavigation()
  return if _.isEmpty navigation
  if navigation.shouldReload
    join = if window.location.search then '&' else '?'
    window.location.href = window.location.href + join + 'reloaded'
  else if navigation.href
    window.location.href = navigation.href

NoExercisesMessage = React.createClass
  render: ->
    <div className="no-exercises">
      <p className="lead">There are no problems to show for this topic.</p>
    </div>


ERROR_HANDLERS =

  no_exercises: (error, message, context) ->
    hideDialog = ->
      {courseId} = context
      context.router.transitionTo('viewStudentDashboard', {courseId})
      Dialog.hide()
    dialog:
      title: 'No exercises are available'
      body: <NoExercisesMessage />
      buttons: [
        <BS.Button key='ok' onClick={hideDialog} bsStyle='primary'>OK</BS.Button>
      ]
    onOk: hideDialog
    onCancel: hideDialog

  default: (error, message, context) ->
    unless error.supportLinkBase?
      {courseId} = context
      error.supportLinkBase = CurrentUserStore.getHelpLink(courseId)
    dialog:
      title: 'Server Error'
      body: <ServerErrorMessage {...error}/>
      buttons: [
        <BS.Button key='ok' onClick={-> Dialog.hide()} bsStyle='primary'>OK</BS.Button>
      ]
    onOk: reloadOnce
    onCancel: reloadOnce

module.exports = React.createClass
  displayName: 'ServerErrorMonitoring'

  mixins: [BindStoreMixin]
  bindStore: AppStore
  bindEvent: 'server-error'

  contextTypes:
    router: React.PropTypes.object

  bindUpdate: ->
    error = AppStore.getError()

    return unless error and -1 is window.location.search.indexOf('reloaded')
    data = {}
    handler = 'default'

    if _.isObject(error.data)
      {data} = error
      if data.errors?.length is 1 and ERROR_HANDLERS[data.errors[0].code]
        handler = data.errors[0].code

    attrs = ERROR_HANDLERS[handler](error, data, @context)
    Dialog.show( attrs.dialog ).then(attrs.onOk, attrs.onCancel)


  # We don't actually render anything
  render: -> null
