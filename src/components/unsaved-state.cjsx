ACTIVE = []
_ = require 'underscore'
{Promise} = require 'es6-promise'
BS = require 'react-bootstrap'
React = require 'react'

WarningDialog = React.createClass
  displayName: 'UnsavedStateWarning'

  propTypes:
    messages:    React.PropTypes.arrayOf( React.PropTypes.string ).isRequired
    show:        React.PropTypes.bool
    onProceed:   React.PropTypes.func.isRequired
    onCancel:    React.PropTypes.func.isRequired
    destination: React.PropTypes.string
  getInitialState: ->
    show: true

  componentWillReceiveProps: (nextProps) ->
    @setState(show: nextProps.show) if nextProps.show?

  onCancel: ->
    @props.onCancel()
    @setState(show: false)

  onProceed: ->
    @props.onProceed()
    @setState(show: false)

  render: ->
    return null unless @state.show
    <BS.Modal className='unsaved-info' onRequestHide={@onCancel}
      title="Proceed to #{@props.destination} ?">
      <div className='modal-body'>
        {for message, i in @props.messages
          <p key={i}>{message}</p>}
      </div>
      <div className='modal-footer'>
        <BS.Button onClick={this.onCancel}>Cancel</BS.Button>
        <BS.Button primary onClick={this.onProceed}>Proceed</BS.Button>
      </div>
    </BS.Modal>


UnsavedStateMixin = {

  componentWillMount:   -> ACTIVE.push @
  componentWillUnmount: -> ACTIVE.splice( ACTIVE.indexOf(@), 1)

  _cannotTransition: ->
    @hasUnsavedState?()

  _unsavedMessage: ->
    @unsavedStateMessage?() or
      "#{@constructor.displayName} has unsaved data"
}

TransitionAssistant = {
  canTransition: -> not _.any(ACTIVE, '_cannotTransition')

  checkTransitionStateTo: (destination) ->
    new Promise (onProceed, onCancel) =>
      if @canTransition()
        onProceed()
      else
        messages = _.invoke(ACTIVE, '_unsavedMessage')
        props = {messages, destination, onCancel, onProceed, show: true}
        if @dialog
          @dialog.setProps(props)
        else
          div = document.body.appendChild( document.createElement('div') )
          @dialog = React.render(React.createElement(WarningDialog, props), div)

}

module.exports = {UnsavedStateMixin, TransitionAssistant}
