React = require 'react'
{AsyncButton} = require 'shared'

SaveAsDraft = React.createClass

  propTypes:
    onClick:   React.PropTypes.func.isRequired
    isWaiting: React.PropTypes.bool.isRequired
    isFailed:  React.PropTypes.bool.isRequired

  render: ->
    return null unless @props.isSavable

    <AsyncButton
      className='-save'
      onClick={@props.onClick}
      isWaiting={@props.isWaiting}
      isFailed={@props.isFailed}
      waitingText='Saving…'
      disabled={@props.isWaiting}
    >
      Save as Draft
    </AsyncButton>


module.exports = SaveAsDraft
