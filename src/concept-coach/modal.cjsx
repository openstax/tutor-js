React = require 'react'
classnames = require 'classnames'
_ = require 'underscore'

{channel} = require './model'
api = require '../api'
navigation = require '../navigation/model'

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
    document.addEventListener('click', @checkAllowed, true)
    document.addEventListener('focus', @checkAllowed, true)

    navigation.channel.on('show.*', @resetScroll)

  componentWillUnmount: ->
    document.removeEventListener('click', @checkAllowed, true)
    document.removeEventListener('focus', @checkAllowed, true)

    navigation.channel.off('show.*', @resetScroll)

  resetScroll: ->
    modal = @getDOMNode()
    modal.scrollTop = 0

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
