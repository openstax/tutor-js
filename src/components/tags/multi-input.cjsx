React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

Wrapper = require './wrapper'
Error = require './error'

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
      @props.actions.setPrefixedTag(@props.id,
        prefix: @props.prefix, tag: value, previous: @props.tag
      )

  onDelete: ->
    @props.actions.setPrefixedTag(@props.id,
      prefix: @props.prefix, tag: false, previous: @props.tag
    )

  render: ->
    <div className={classnames('tag', 'has-error': @state.errorMsg)}>
      <input
        className='form-control'
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
    id:            React.PropTypes.string.isRequired
    store:         React.PropTypes.object.isRequired
    actions:       React.PropTypes.object.isRequired
    label:         React.PropTypes.string.isRequired
    prefix:        React.PropTypes.string.isRequired
    cleanInput:    React.PropTypes.func.isRequired
    validateInput: React.PropTypes.func.isRequired

  add: ->
    @props.actions.addBlankPrefixedTag(@props.id, prefix: @props.prefix)

  render: ->
    tags = @props.store.getTagsWithPrefix(@props.id, @props.prefix)

    <Wrapper label={@props.label} onAdd={@add} singleTag={tags.length is 1}>
      {for tag in tags
        <Input key={tag} {...@props} tag={tag} />}
    </Wrapper>

module.exports = MultiInput
