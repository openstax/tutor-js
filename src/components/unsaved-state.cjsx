ACTIVE = []
_ = require 'underscore'
{Promise} = require 'es6-promise'
BS = require 'react-bootstrap'
React = require 'react'

WarningDialog = React.createClass
  displayName: 'UnsavedStateWarning'

  propTypes:
    messages: React.PropTypes.arrayOf( React.PropTypes.string ).isRequired

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
    <BS.Modal className='unsaved-info' onRequestHide={@onCancel} title="Are you sure?">
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

  checkTransitionState: (callback) ->
    new Promise (resolve, reject) =>
      if @canTransition()
        resolve()
      else
        messages = _.invoke(ACTIVE, '_unsavedMessage')
        unless @dialog
          div = document.body.appendChild( document.createElement('div') )
          @dialog = React.render(React.createElement(WarningDialog, messages: messages), div)

        @dialog.setProps(show: true, messages: messages, onCancel: reject, onProceed: resolve)

}

module.exports = {UnsavedStateMixin, TransitionAssistant}
