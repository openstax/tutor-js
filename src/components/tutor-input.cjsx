React = require 'react'
BS = require 'react-bootstrap'
{DateTimePicker} = require 'react-widgets'

TutorInput = React.createClass
  propTypes:
    label: React.PropTypes.string.isRequired
    id: React.PropTypes.string
    className: React.PropTypes.string
    onChange: React.PropTypes.func
    value: React.PropTypes.any

  onChange: (event) ->
    @props.onChange(event.target?.value, event.target)

  render: ->
    classes = ['form-control']
    unless @props.default then classes.push('empty')
    classes.push(@props.class)

    <div className="form-control-wrapper">
      <input
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
    id: React.PropTypes.string
    className: React.PropTypes.string
    onChange: React.PropTypes.func
    value: React.PropTypes.any

  getInitialState: ->
    {height: '2em'}

  onChange: (event) ->
    @setState({height: event.target.scrollHeight})
    @props.onChange(event.target?.value, event.target)

  render: ->
    classes = ['form-control']
    unless @props.default then classes.push('empty')
    classes.push(@props.inputClass)

    <div className="form-control-wrapper">
      <textarea
        id={@props.inputId}
        ref='textarea'
        type='text'
        className={classes.join(' ')}
        defaultValue={@props.default}
        onChange={@onChange} 
        style= {height: @state.height}/>
      <div className="floating-label">{@props.label}</div>
    </div>

module.exports = {TutorInput, TutorDateInput, TutorTextArea}
