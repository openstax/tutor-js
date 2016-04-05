React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Wrapper = require './wrapper'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

PREFIX = 'format'
TYPES =
  'multiple-choice' : 'Multiple Choice'
  'true-false'      : 'True/False'
  'open-ended'      : 'Open Ended'
  'vocabulary'      : 'Vocabulary'


FilterTypeTag = React.createClass

  getInitialState: -> {}

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  updateTag: (ev) ->
    ExerciseActions.setPrefixedTag(@props.exerciseId, prefix: PREFIX, tag: ev.target.value)

  setChoiceRequired: (ev) ->
    console.log ev.target.checked, ev.target.value
    @setState(isChoiceRequired: ev.target.checked)

  render: ->
    tag = _.first ExerciseStore.getTagsWithPrefix(@props.exerciseId, PREFIX)
    availableTypes = if @state.isChoiceRequired
      _.pick TYPES, (name, id) -> id isnt 'open-ended'
    else
      TYPES

    <Wrapper label="Format">
      <div className="tag format-type">
        <BS.Input type="checkbox" label="Requires Choice"
          onChange={@setChoiceRequired}
          checked={@state.isChoiceRequired} />
        {for id, name of availableTypes
          <BS.Input key={id} value={id} type="radio" name={PREFIX} label={name}
            checked={tag is id} onChange={@updateTag} />}
      </div>
    </Wrapper>

module.exports = FilterTypeTag
