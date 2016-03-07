React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'

FixedTag = React.createClass
  updateTag: (event) ->
    newValue = event.target?.value
    ExerciseActions.updateFixedTag(@props.id, @props.value, newValue)

  renderRangeValue: (value) ->
    optionValue = "#{@props.base}#{@props.separator}#{value}"
    <option key={value} value={optionValue}>{optionValue}</option>

  render: ->
    <select onChange={@updateTag} defaultValue={@props.value}>
      <option value=''>No {@props.base} tag</option>
      {_.map(@props.range, @renderRangeValue)}
    </select>

module.exports = React.createClass
  displayName: 'ExerciseTags'

  updateTags: (event) ->
    tagsArray = event.target?.value.split("\n")
    ExerciseActions.updateTags(@props.id, tagsArray)

  renderFixedTag: (fixedTag) ->
    <FixedTag key={fixedTag.base} id={@props.id} {...fixedTag} />

  render: ->
    {id} = @props

    fixed = _.map(ExerciseStore.getFixedTags(id), @renderFixedTag)

    <BS.Row className="tags">
      <p><label>Tags</label></p>
      <BS.Col xs={6}>
        <textarea onChange={@updateTags} defaultValue={ExerciseStore.getEditableTags(id).join('\n')}>
        </textarea>
      </BS.Col>
      <BS.Col xs={6}>
        {fixed}
      </BS.Col>
    </BS.Row>
