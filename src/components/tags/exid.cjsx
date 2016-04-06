React = require 'react'

_ = require 'underscore'
classnames = require 'classnames'
Error = require './error'
Wrapper = require './wrapper'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

PREFIX = 'exid'

Input = React.createClass

  getDefaultProps: ->
    inputType: 'text'

  propTypes:
    book: React.PropTypes.string.isRequired

  getStoreValue: ->
    _.first ExerciseStore.getTagsWithPrefix(@props.exerciseId, @prefix())

  getInitialState: ->
    value: @getStoreValue() or ''

  onChange: (ev) ->
    value = ev.target.value
    if value.match(/\D/)
      @setState(errorMsg: 'ID must be numeric')
    else
      @setState({value, errorMsg: null})

  prefix: ->
    PREFIX + ':' + @props.book

  validateAndSave: (ev) ->
    {value} = @state
    ExerciseActions.setPrefixedTag(@props.exerciseId,
       prefix: @prefix(), tag: value, replaceOthers: true
    )

  render: ->
    <div className={classnames('tag', 'has-error': @state.errorMsg)}>
      <span>{@props.book}:</span>
      <input
        className='form-control'
        type={@props.inputType}
        onChange={@onChange}
        onBlur={@validateAndSave}
        value={@state.value}
        placeholder={@props.placeholder} />
      <Error error={@state.errorMsg} />
    </div>

ExIdTags = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  render: ->
    tags = ExerciseStore.getTagsWithPrefix(@props.exerciseId, 'book')
    <Wrapper label="Exercise IDs">
      {for tag in tags
        <Input key={tag} {...@props} book={tag} />}
    </Wrapper>

module.exports = ExIdTags
