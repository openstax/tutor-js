React = require 'react'

{channel} = require './model'

CCModal = React.createClass
  displayName: 'CCModal'
  componentDidMount: ->
    mountData = modal: el: @getDOMNode()
    channel.emit('modal.mount.success', mountData)

  render: ->
    <div className='concept-coach-modal'>
      {@props.children}
    </div>

module.exports = {CCModal, channel}
