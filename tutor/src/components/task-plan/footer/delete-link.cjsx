React = require 'react'
{AsyncButton, SuretyGuard} = require 'shared'
Icon = require '../../icon'

DeleteLink = React.createClass

  propTypes:
    onClick:     React.PropTypes.func.isRequired
    isWaiting:   React.PropTypes.bool.isRequired
    isFailed:    React.PropTypes.bool.isRequired
    isNew:       React.PropTypes.bool.isRequired
    isVisibleToStudents: React.PropTypes.bool.isRequired

  render: ->
    return null if @props.isNew and not @props.isWaiting

    message = 'Are you sure you want to delete this assignment?'

    if @props.isVisibleToStudents
      message = "Some students may have started work on this assignment. #{message}"

    <SuretyGuard
      onConfirm={@props.onClick}
      okButtonLabel='Yes'
      placement='top'
      message={message}
    >
      <AsyncButton
        className='delete-link pull-right'
        isWaiting={@props.isWaiting}
        isFailed={@props.isFailed}
        waitingText='Deleting…'
      >
        <Icon type="trash" /> Delete Assignment
      </AsyncButton>

    </SuretyGuard>


module.exports = DeleteLink
