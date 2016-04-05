React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

Wrapper = require './wrapper'
Error = require './error'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

Input = React.createClass

  getDefaultProps: ->
    inputType: 'text'

  propTypes:
    tag: React.PropTypes.string.isRequired

  getInitialState: ->
    value: @props.tag

  componentWillReceiveProps: (nextProps) ->
    @setState(value: nextProps.tag)

  onChange: (ev) ->
    @setState(errorMsg: null, value: @props.cleanInput(ev.target.value))

  validateAndSave: (ev) ->
    {value} = @state
    error = @props.validateInput(value)
    if error
      @setState({errorMsg: error})
    else
      ExerciseActions.setPrefixedTag(@props.exerciseId,
        prefix: @props.prefix, tag: value, previous: @props.tag
      )

  render: ->
    <div className={classnames('tag', 'has-error': @state.errorMsg)}>
      <input
        type={@props.inputType}
        onChange={@onChange}
        onBlur={@validateAndSave}
        value={@state.value}
        placeholder={@props.placeholder} />
      <Error error={@state.errorMsg} />
      <span className="controls">
        <i onClick={@onDelete} className="fa fa-trash" />
      </span>
    </div>

MultiInput = React.createClass

  propTypes:
    label:  React.PropTypes.string.isRequired
    prefix: React.PropTypes.string.isRequired
    cleanInput:    React.PropTypes.func.isRequired
    exerciseId:    React.PropTypes.string.isRequired
    validateInput: React.PropTypes.func.isRequired

  add: ->
    ExerciseActions.addBlankPrefixedTag(@props.exerciseId, prefix: @props.prefix)

  render: ->
    tags = ExerciseStore.getTagsWithPrefix(@props.exerciseId, @props.prefix)

    <Wrapper label={@props.label} onAdd={@add}>
      {for tag in tags.sort()
        <Input key={tag} {...@props} tag={tag} />}
    </Wrapper>

module.exports = MultiInput
