React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

{ExerciseActions, ExerciseStore} = require '../stores/exercise'



MPQToggle = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  onConfirm: ->
    @refs.overlay.hide()
    ExerciseActions.toggleMultiPart(@props.exerciseId)

  onCancel: ->
    @refs.overlay.hide()


  onToggleMPQ: (ev) ->
    # show warning if going from multi-part to multiple choice
    if ExerciseStore.isMultiPart(@props.exerciseId)
      ev.preventDefault()
    else
      ExerciseActions.toggleMultiPart(@props.exerciseId)

  render: ->
    showMPQ = ExerciseStore.isMultiPart(@props.exerciseId)

    checkbox = <BS.Input type="checkbox" label="Exercise contains multiple parts"
      checked={showMPQ} wrapperClassName="mpq-toggle" onChange={@onToggleMPQ} />

    if showMPQ
      warning =
        <BS.Popover
          className="mpq-toggle-prompt" title="Are you sure?"
        >
          If this exercise is converted to be multiple-choice,
         the intro and all but the first question will be removed.
          <div className="controls">
            <BS.Button onClick={@onCancel}>Cancel</BS.Button>
            <BS.Button onClick={@onConfirm} bsStyle="primary">Convert</BS.Button>
          </div>
        </BS.Popover>
      <BS.OverlayTrigger
        ref="overlay"
        placement="left"
        trigger="click"
        overlay={warning}
      >
        {checkbox}
      </BS.OverlayTrigger>
    else
      checkbox

module.exports = MPQToggle
