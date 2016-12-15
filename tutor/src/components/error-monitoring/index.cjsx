React = require 'react'
BindStoreMixin = require '../bind-store-mixin'
BS = require 'react-bootstrap'
isEmpty = require 'lodash/isEmpty'

ErrorHandlers = require './handlers'

{AppStore, AppActions} = require '../../flux/app'

Dialog = require '../tutor-dialog'


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

    handlerArgs = {error, data: error.data, @context}

    if _.isObject(handlerArgs.data) and handlerArgs.data.errors?.length is 1
      dialogAttrs = ErrorHandlers.getDialogAttributesForCode(
        handlerArgs.data.errors[0].code, handlerArgs
      )
    dialogAttrs ?= ErrorHandlers.defaultDialogAttributes(handlerArgs)
    Dialog.show( dialogAttrs.dialog ).then(dialogAttrs.onOk, dialogAttrs.onCancel)


  # We don't actually render anything
  render: -> null
