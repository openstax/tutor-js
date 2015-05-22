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
    console.log(open)

  render: ->
    classes = ['form-control']
    unless @props.value then classes.push('empty')
    if @state.expandCalendar
      @props.open = 'calendar'
      @props.onToggle = @onToggle
    else
      @props.open = false
      
    dateProps = _.map(@props, _.clone)
    dateProps.onChange = @dateSelected

    if (dateProps.onChange is @props.onChange)
      console.log('same')
    else
      console.log('different')

    <div onBlur={@closeCalendar} onFocus={@expandCalendar} className="form-control-wrapper">
      <input type='text' onFocus={@expandCalendar} disabled className={classes.join(' ')} />
      <div className="floating-label">{@props.label}</div>
      <DateTimePicker {...dateProps}/>
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
