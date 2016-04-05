React = require 'react'
_ = require 'underscore'

Wrapper = require './wrapper'

PREFIX = 'question-type'
TYPES =
  'conceptual-or-recall' : 'Conceptual or Recall'
  'conceptual'           : 'Conceptual'
  'recall'               : 'Recall'
  'practice'             : 'Practice'

QuestionTypeTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  updateTag: (ev) ->
    ExerciseActions.setPrefixedTag(@props.exerciseId,
      tag: ev.target.value, prefix: PREFIX, replaceOthers: true
    )

  render: ->
    tag = _.first ExerciseStore.getTagsWithPrefix(@props.exerciseId, PREFIX)
    <Wrapper label="Question Type">
      <div className="tag">
        <select onChange={@updateTag} value={@props.tag}>
          {unless tag # a tag cannot be blank once it's set
            <option key='blank' value={''}>{name}</option>}
          {for tag, name of TYPES
            <option key={tag} value={tag}>{name}</option>}
        </select>
      </div>

    </Wrapper>

module.exports = QuestionTypeTag
