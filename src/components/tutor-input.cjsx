React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
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

  getInitialState: ->
    {expandCalendar: false}

  expandCalendar: ->
    @setState({expandCalendar: true})

  dateSelected: (value) ->
    @setState({expandCalendar: false})
    @props.onChange(value)

  onToggle: (open) ->
    @setState({expandCalendar: false})
    console.log(open)

  render: ->
    classes = ['form-control']
    unless @props.value then classes.push('empty')
    open = false

    if @state.expandCalendar and not @props.readOnly
      open = 'calendar'
      onToggle = @onToggle

    <div className="form-control-wrapper">
      <input type='text' onFocus={@expandCalendar} disabled className={classes.join(' ')} />
      <div className="floating-label">{@props.label}</div>
      <DateTimePicker onFocus={@expandCalendar} 
        id={@props.id}
        format='MMM dd, yyyy'
        time={false}
        calendar={true}
        open={open}
        onToggle={onToggle}
        className="form-control"
        onChange={@dateSelected}
        readOnly={@props.readOnly}
        min={@props.min}
        value={@props.value}
      />
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
