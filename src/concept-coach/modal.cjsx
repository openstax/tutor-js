React = require 'react'
classnames = require 'classnames'
_ = require 'underscore'

{channel} = require './model'
api = require '../api'

CCModal = React.createClass
  displayName: 'CCModal'
  getInitialState: ->
    isLoaded: false

  componentDidMount: ->
    mountData = modal: el: @getDOMNode()
    channel.emit('modal.mount.success', mountData)
    mountData.modal.el.focus()

    # only wait to set loaded if there is a pending api call
    if api.isPending()
      api.channel.once('completed', @setLoaded)
    else
      @setLoaded()

  componentWillMount: ->
    document.addEventListener('click', this.checkAllowed, true)
    document.addEventListener('focus', this.checkAllowed, true)

  componentWillUnmount: ->
    document.removeEventListener('click', this.checkAllowed, true)
    document.removeEventListener('focus', this.checkAllowed, true)

  checkAllowed: (focusEvent) ->
    modal = @getDOMNode()
    unless modal.contains(focusEvent.target)
      focusEvent.preventDefault()
      focusEvent.stopImmediatePropagation()
      modal.focus()

  setLoaded: ->
    {isLoaded} = @state
    @setState(isLoaded: true) unless isLoaded

  render: ->
    {isLoaded} = @state

    classes = classnames 'concept-coach-modal',
      loaded: isLoaded

    <div className={classes} role='dialog' tabIndex='-1'>
      <div role='document'>
        {@props.children}
      </div>
    </div>

module.exports = {CCModal, channel}
