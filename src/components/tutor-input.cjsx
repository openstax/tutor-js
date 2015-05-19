React = require 'react'
BS = require 'react-bootstrap'
{DateTimePicker} = require 'react-widgets'

TutorInput = React.createClass
  propTypes:
    label: React.PropTypes.string.isRequired
    ref: React.PropTypes.string
    id: React.PropTypes.string
    className: React.PropTypes.string
    onChange: React.PropTypes.func
    value: React.PropTypes.any

  onChange: ->
    domNode = @refs[@props.inputRef].getDOMNode()
    @props.onChange(domNode?.value, domNode)

  render: ->
    classes = ['form-control']
    unless @props.default then classes.push('empty')
    classes.push(@props.class)

    <div className="form-control-wrapper">
      <input
        ref={@props.inputRef}
        id={@props.id}
        type='text'
        className={classes.join(' ')}
        defaultValue={@props.default}
        onChange={@onChange} />
      <div className="floating-label">{@props.label}</div>
    </div>

TutorDateInput = React.createClass

  render: ->
    classes = ['form-control']
    unless @props.value then classes.push('empty')
    <div className="form-control-wrapper">
      <input type='text' disabled className={classes.join(' ')} />
      <div className="floating-label">{@props.label}</div>
      <DateTimePicker {...@props}/>
    </div>

TutorTextArea = React.createClass
  propTypes:
    label: React.PropTypes.string.isRequired
    ref: React.PropTypes.string
    id: React.PropTypes.string
    className: React.PropTypes.string
    onChange: React.PropTypes.func
    value: React.PropTypes.any

  onChange: ->
    domNode = @refs[@props.inputRef].getDOMNode()
    @props.onChange(domNode?.value, domNode)

  render: ->
    classes = ['form-control']
    unless @props.default then classes.push('empty')
    classes.push(@props.inputClass)

    <div className="form-control-wrapper">
      <textarea
        ref={@props.inputRef}
        id={@props.inputId}
        type='text'
        className={classes.join(' ')}
        defaultValue={@props.default}
        onChange={@onChange} />
      <div className="floating-label">{@props.label}</div>
    </div>

module.exports = {TutorInput, TutorDateInput, TutorTextArea}
