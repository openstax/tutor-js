React = require 'react'
ReactDOM = require 'react-dom'
classnames = require 'classnames'
isEqual = require 'lodash/isEqual'

{channel} = require './model'
api = require '../api'
navigation = require '../navigation/model'

CCModal = React.createClass
  displayName: 'CCModal'
  propTypes:
    setIsLoaded: React.PropTypes.func
  getInitialState: ->
    isLoaded: false

  componentDidMount: ->
    mountData = modal: el: @getDomNode()
    channel.emit('modal.mount.success', mountData)
    mountData.modal.el.focus()

    # only wait to set loaded if there is a pending api call
    if api.isPending()
      api.channel.once('*.*.*.receive.*', @setLoaded)
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

  resetScroll: (displaying = {}) ->
    unless isEqual(displaying, @previouslyDisplaying)
      @previouslyDisplaying = displaying
      @getDomNode().scrollTop = 0

  getDomNode: ->
    ReactDOM.findDOMNode(@)

  checkAllowed: (focusEvent) ->
    modal = @getDomNode()
    unless focusEvent.target is modal or modal.contains(focusEvent.target) or @props.filterClick?(focusEvent)
      console?.warn "CC ignoring outside click to element ", focusEvent.target
      focusEvent.preventDefault()
      focusEvent.stopImmediatePropagation()
      modal.focus()

  setLoaded: ->
    @props.setIsLoaded?()
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
