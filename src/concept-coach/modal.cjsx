React = require 'react'
classnames = require 'classnames'

{channel} = require './model'
api = require '../api'

CCModal = React.createClass
  displayName: 'CCModal'
  getInitialState: ->
    isLoaded: false

  componentDidMount: ->
    mountData = modal: el: @getDOMNode()
    channel.emit('modal.mount.success', mountData)

  componentWillMount: ->
    api.channel.once 'success', @setLoaded

  setLoaded: ->
    @setState(isLoaded: true)

  render: ->
    {isLoaded} = @state

    classes = classnames 'concept-coach-modal',
      loaded: isLoaded

    <div className={classes}>
      {@props.children}
    </div>

module.exports = {CCModal, channel}
