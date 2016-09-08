React = require 'react'
BS = require 'react-bootstrap'
{AsyncButton} = require 'shared'

MESSAGES =

  publish:
    action: 'Publish'
    waiting: 'Publishing…'

  save:
    action: 'Save'
    waiting: 'Saving…'


TaskSaveButton = React.createClass

  propTypes:
    onSave: React.PropTypes.func.isRequired
    onPublish: React.PropTypes.func.isRequired
    isEditable:   React.PropTypes.bool.isRequired
    isSaving:     React.PropTypes.bool.isRequired
    isWaiting:    React.PropTypes.bool.isRequired
    isPublished:  React.PropTypes.bool.isRequired
    isPublishing: React.PropTypes.bool.isRequired

  render: ->
    return null unless @props.isEditable

    {isPublished} = @props

    isBusy = if isPublished
      @props.isWaiting and (@props.isSaving or @props.isPublishing)
    else
      @props.isWaiting and @props.isPublishing

    Text = if isPublished then MESSAGES.save else MESSAGES.publish

    <AsyncButton
        isJob={true}
        bsStyle='primary'
        className='-publish'
        onClick={if isPublished then @props.onSave else @props.onPublish}
        waitingText={Text.waiting}
        isFailed={@props.isFailed}
        disabled={@props.isWaiting}
        isWaiting={@props.isWaiting}
      >
          {Text.action}
    </AsyncButton>


module.exports = TaskSaveButton
