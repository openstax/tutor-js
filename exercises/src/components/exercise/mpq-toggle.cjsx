React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'

{SuretyGuard} = require 'shared'

MPQToggle = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  onConfirm: ->
    ExerciseActions.toggleMultiPart(@props.exerciseId)

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
      <SuretyGuard
        onConfirm={@onConfirm}
        okButtonLabel='Convert'
        placement='left'
        message={'''
          If this exercise is converted to be multiple-choice,
          the intro and all but the first question will be
          removed.'''}
      >{checkbox}</SuretyGuard>
    else
      checkbox

module.exports = MPQToggle
