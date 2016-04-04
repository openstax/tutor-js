React = require 'react'
classnames = require 'classnames'

Wrapper = require './wrapper'
Error = require './error'

{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

LoTagInput = React.createClass

  propTypes:
    tag: React.PropTypes.string.isRequired

  getInitialState: ->
    value: @props.tag

  componentWillReceiveProps: (nextProps) ->
    @setState(value: nextProps.tag)

  onChange: (ev) ->
    @setState(errorMsg: null, value: ev.target.value.replace(/[^0-9\-]/g, ''))

  validate: (ev) ->
    {value} = @state
    if value.match(/^\d+-\d+-\d+$/)
      ExerciseActions.setPrefixedTag(@props.exerciseId,
        prefix: 'lo', tag: value, previous: @props.tag
      )
    else
      @setState({errorMsg: 'Must match LO format'})

  render: ->
    <div className={classnames('tag', 'has-error': @state.errorMsg)}>
      <input
        onChange={@onChange}
        onBlur={@validate}
        value={@state.value}
        placeholder='nn-nn-nn' />
      <Error error={@state.errorMsg} />
      <span className="controls">
        <i onClick={@onDelete} className="fa fa-trash" />
      </span>
    </div>

LoTags = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  add: ->
    ExerciseActions.addBlankPrefixedTag(@props.exerciseId, prefix: 'lo')

  render: ->
    tags = ExerciseStore.getTagsWithPrefix(@props.exerciseId, 'lo')

    <Wrapper label="LO" onAdd={@add}>
      {for tag in tags
        <LoTagInput key={tag} {...@props} tag={tag} />}

    </Wrapper>

module.exports = LoTags
