ACTIVE = []
_ = require 'underscore'
{Promise} = require 'es6-promise'
moment = require 'moment'
React = require 'react'
TutorDialog = require './tutor-dialog'


UnsavedStateMixin = {

  componentWillMount:   -> ACTIVE.push @
  componentWillUnmount: -> ACTIVE.splice( ACTIVE.indexOf(@), 1)

  _cannotTransition: -> @hasUnsavedState?()

  _unsavedMessages: ->
    @unsavedStateMessages?() or
      ["#{@constructor.displayName} has unsaved data"]
}

TransitionAssistant = {
  canTransition: -> not _.any(ACTIVE, (c) -> c._cannotTransition())
  unsavedMessages: -> _.flatten( _.invoke(ACTIVE, '_unsavedMessages'), 1)
  checkTransitionStateTo: (destination) ->

    new Promise (onOk, onCancel) =>
      if @canTransition()
        onOk()
      else
        body =
          <div>
            {for message, i in @unsavedMessages()
              <p key={i}>{message}</p>}
          </div>

        TutorDialog.show({
          title: "Proceed to #{destination} ?", body
        }).then( =>
          @lastCancel = moment()
          onOk()
        , onCancel )

  # transistions should be allowed for the next second if a transistion was just approved
  wasJustApproved: ->
    @lastCancel and @lastCancel.isBefore( moment().add(1, 'second') )

  startMonitoring: ->
    delete @startMonitoring # remove the function so it can't be called twice
    window.onbeforeunload = =>
      unless @canTransition() or @wasJustApproved()
        return @unsavedMessages().join("\n")

}

module.exports = {UnsavedStateMixin, TransitionAssistant}
