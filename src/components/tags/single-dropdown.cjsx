React = require 'react'
_ = require 'underscore'

Wrapper = require './wrapper'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

SingleDropdown = React.createClass

  propTypes:
    label:  React.PropTypes.string.isRequired
    prefix: React.PropTypes.string.isRequired
    exerciseId:    React.PropTypes.string.isRequired


  updateTag: (ev) ->
    ExerciseActions.setPrefixedTag(@props.exerciseId,
      tag: ev.target.value, prefix: @props.prefix, replaceOthers: true
    )

  render: ->
    tag = _.first ExerciseStore.getTagsWithPrefix(@props.exerciseId, @props.prefix)
    <Wrapper label={@props.label} singleTag={true}>
      <div className="tag">
        <select className='form-control' onChange={@updateTag} value={tag}>
          {unless tag # a tag cannot be blank once it's set
            <option key='blank' value={''}>{name}</option>}
          {for tag, name of @props.choices
            <option key={tag} value={tag}>{name}</option>}
        </select>
      </div>
    </Wrapper>

module.exports = SingleDropdown
