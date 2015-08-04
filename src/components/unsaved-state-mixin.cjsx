ACTIVE = []
_ = require 'underscore'
{Promise} = require 'es6-promise'

React = require 'react'
TutorDialog = require './tutor-dialog'


UnsavedStateMixin = {

  componentWillMount:   -> ACTIVE.push @
  componentWillUnmount: -> ACTIVE.splice( ACTIVE.indexOf(@), 1)

  _cannotTransition: -> @hasUnsavedState?()

  _unsavedMessage: ->
    @unsavedStateMessage?() or
      "#{@constructor.displayName} has unsaved data"
}

TransitionAssistant = {
  canTransition: -> not _.any(ACTIVE, (c) -> c._cannotTransition())
  unsavedMessages: -> _.invoke(ACTIVE, '_unsavedMessage')
  checkTransitionStateTo: (destination) ->

    new Promise (onProceed, onCancel) =>
      if @canTransition()
        onProceed()
      else
        body =
          <div>
            {for message, i in @unsavedMessages
              <p key={i}>{message}</p>}
          </div>

        TutorDialog.show({
          title: "Proceed to #{destination} ?", body
        }).then( onProceed, onCancel )

}

module.exports = {UnsavedStateMixin, TransitionAssistant}
