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

  isValid: (value) ->
    valid = true
    valid = false if (@props.min and value < @props.min)
    valid = false if (@props.max and value > @props.max)
    valid

  dateSelected: (value) ->
    valid = @isValid(value)
    @props.onChange(value) if (valid)
    @setState({expandCalendar: false, valid: valid})

  onToggle: (open) ->
    @setState({expandCalendar: open})

  clickHandler: (event) ->
    if (event.target.tagName is "INPUT" and not @state.expandCalendar)
      @setState({expandCalendar: true})

  parseDate: (dateStr) ->
    date = new Date(dateStr)
    min = @props.min or ""
    if (not date or not @isValid(date))
      date = new Date(min)

    date

  render: ->
    classes = ['form-control']
    unless @props.value then classes.push('empty')
    open = false

    if @state.expandCalendar and not @props.readOnly and not @state.justToggled
      open = 'calendar'
      onToggle = @onToggle

    value = @props.value

    <div className="form-control-wrapper">
      <input type='text' disabled className={classes.join(' ')} />
      <div className="floating-label">{@props.label}</div>
      <DateTimePicker onClick={@clickHandler}
        onFocus={@expandCalendar} 
        parse={@parseDate}
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
        value={value}
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
