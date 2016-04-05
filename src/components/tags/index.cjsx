React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

BookTags = require './books'
LoTag = require './lo'
QuestionTypeTag = require './question-type'

ExerciseTags = React.createClass
  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  updateTags: (event) ->
    tagsArray = event.target?.value.split("\n")
    ExerciseActions.updateTags(@props.id, tagsArray)

  renderFixedTag: (fixedTag) ->
    <FixedTag key={fixedTag.base} id={@props.id} {...fixedTag} />

  render: ->
    {id} = @props

    <div className="tags">
      <BS.Row>
        <BookTags        {...@props} />
        <LoTag           {...@props} />
        <QuestionTypeTag {...@props} />
      </BS.Row>
    </div>


module.exports = ExerciseTags
