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
    # ensure cc show even if no api call has been made on cc open
    _.delay @setLoaded, 1000

  componentWillMount: ->
    api.channel.once 'success', @setLoaded

  setLoaded: ->
    {isLoaded} = @state
    @setState(isLoaded: true) unless isLoaded

  render: ->
    {isLoaded} = @state

    classes = classnames 'concept-coach-modal',
      loaded: isLoaded

    <div className={classes} tabIndex="-1">
      {@props.children}
    </div>

module.exports = {CCModal, channel}
