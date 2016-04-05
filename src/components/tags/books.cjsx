React = require 'react'

Wrapper = require './wrapper'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

BOOKS =
  'stax-soc'     : 'Sociology'
  'stax-phys'    : 'College Physics'
  'stax-k12phys' : 'Physics',
  'stax-bio'     : 'Biology'
  'stax-apbio'   : 'Biology for AP® Courses'
  'stax-econ'    : 'Economics'
  'stax-macro'   : 'Macro Economics'
  'stax-micro'   : 'Micro Economics'
  'stax-cbio'    : 'Concepts of Biology'
  'stax-anp'     : 'Anatomy and Physiology'

BookTagSelect = React.createClass

  updateTag: (ev) ->
    ExerciseActions.setPrefixedTag(@props.exerciseId,
      prefix: 'book', tag: ev.target.value, previous: @props.tag
    )
  onDelete: ->
    ExerciseActions.setPrefixedTag(@props.exerciseId,
      prefix: 'book', tag: '', previous: @props.tag
    )
  render: ->
    <div className="tag">
      <select onChange={@updateTag} value={@props.tag}>
        <option key='blank' value={''}>{name}</option>}
        {for tag, name of BOOKS
          <option key={tag} value={tag}>{name}</option>}
      </select>
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
    <Wrapper label="Book" onAdd={@add}>
      {for tag in tags
        <BookTagSelect key={tag} {...@props} tag={tag} />}
    </Wrapper>


module.exports = BookTags
