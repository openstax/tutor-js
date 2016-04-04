React = require 'react'
_ = require 'underscore'

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

BookTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  updateTag: (ev) ->
    for tag, name of BOOKS
      ExerciseActions.removeTag(@props.exerciseId, tag)
    newTag = ev.target.value
    if newTag
      ExerciseActions.addTag(@props.exerciseId, newTag)

  render: ->
    {tags} = ExerciseStore.get(@props.exerciseId)
    tag = _.find tags, (tag) -> BOOKS[tag.id]
    <Wrapper label="Book">
      <select onChange={@updateTag} value={tag?.id}>
        <option key='blank' value={''}>{name}</option>}
        {for tag, name of BOOKS
          <option key={tag} value={tag}>{name}</option>}
      </select>
    </Wrapper>

module.exports = BookTag
