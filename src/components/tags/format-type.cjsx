React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Wrapper = require './wrapper'
Multiselect = require 'react-widgets/lib/Multiselect'

PREFIX = 'format'
TYPES =
  'multiple-choice' : 'Multiple Choice'
  'true-false'      : 'True/False'
  'open-ended'      : 'Open Ended'
  'vocabulary'      : 'Vocabulary'


FilterTypeTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  updateTag: (ev) ->
    ExerciseActions.setPrefixedTag(@props.exerciseId, prefix: PREFIX, tag: ev.target.value)

  render: ->
    tag = _.first ExerciseStore.getTagsWithPrefix(@props.exerciseId, PREFIX)

    <Wrapper label="Format">
      <div className="tag format-type">
        {for id, name of TYPES
          <BS.Input key={id} value={id} type="radio" name={PREFIX} label={name}
            checked={tag is id} onChange={@updateTag} />}
      </div>
    </Wrapper>

module.exports = FilterTypeTag
