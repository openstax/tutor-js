React = require 'react'

{channel} = require './model'

CCModal = React.createClass
  displayName: 'CCModal'
  componentDidMount: ->
    channel.emit('modal.mount.success')

  render: ->
    <div className='concept-coach-modal'>
      {@props.children}
    </div>

module.exports = {CCModal, channel}
