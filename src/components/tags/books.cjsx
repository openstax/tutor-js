React = require 'react'

Wrapper = require './wrapper'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

BookSelection = require './book-selection'

BookTagSelect = React.createClass
  propTypes:
    book: React.PropTypes.string.isRequired

  updateTag: (ev) ->
    ExerciseActions.setPrefixedTag(@props.exerciseId,
      prefix: 'book', tag: ev.target.value, previous: @props.book
    )

  onDelete: ->
    ExerciseActions.setPrefixedTag(@props.exerciseId,
      prefix: 'book', tag: false, previous: @props.book
    )
    ExerciseActions.setPrefixedTag(@props.exerciseId,
      prefix: "exid:#{@props.book}", tag: false, replaceOthers: true
    )

  render: ->
    <div className="tag">
      <BookSelection onChange={@updateTag} selected={@props.book} />
      <span className="controls">
        <i onClick={@onDelete} className="fa fa-trash" />
      </span>
    </div>

BookTags = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  add: ->
    ExerciseActions.addBlankPrefixedTag(@props.exerciseId,
      prefix: 'book'
    )

  render: ->
    tags = ExerciseStore.getTagsWithPrefix(@props.exerciseId, 'book')
    <Wrapper label="Book" onAdd={@add}  singleTag={tags.length is 1}>
      {for tag in tags
        <BookTagSelect key={tag} {...@props} book={tag} />}
    </Wrapper>


module.exports = BookTags
