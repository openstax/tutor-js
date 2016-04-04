React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

BookTags = require './books'

LoTag = require './lo'

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

    # fixed = _.map(ExerciseStore.getFixedTags(id), @renderFixedTag)
    #   <p><label>Tags</label></p>
    #   <BS.Col xs={6}>
    #     <textarea onChange={@updateTags} defaultValue={ExerciseStore.getEditableTags(id).join('\n')}>
    #     </textarea>
    #   </BS.Col>
    #   <BS.Col xs={6}>
    #     {fixed}
    #   </BS.Col>

    <div className="tags">

      <BS.Row>
        <BookTags {...@props} />
        <LoTag {...@props} />
      </BS.Row>
    </div>


module.exports = ExerciseTags
