React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment'

{TimeStore} = require '../flux/time'
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
    wrapperClasses = ["form-control-wrapper", "tutor-input"]

    unless @props.default then classes.push('empty')
    if @props.required then wrapperClasses.push('is-required')
    classes.push(@props.class)

    <div className={wrapperClasses.join(' ')}>
      <input
        id={@props.id}
        type='text'
        className={classes.join(' ')}
        defaultValue={@props.default}
        onChange={@onChange} />
      <div className="floating-label">{@props.label}</div>
      <div className="hint required-hint">
        Required Field <i className="fa fa-exclamation-circle"></i>
      </div>
    </div>

DayComponent = React.createClass
  propTypes:
    date:  React.PropTypes.string.isRequired
    label: React.PropTypes.string.isRequired

  isInvalid: ->
    moment(@props.date).startOf('day') < TimeStore.getNow()

  onClick: (ev) ->
    ev.stopPropagation() if @isInvalid()

  render: ->
    <span onClick={@onClick} className={'is-invalid-date' if @isInvalid()}>
      {@props.label}
    </span>

TutorDateInput = React.createClass

  getInitialState: ->
    {expandCalendar: false}

  expandCalendar: ->
    @setState({expandCalendar: true, hasFocus: true})

  isValid: (value) ->
    valid = true
    valid = false if (@props.min and value < @props.min)
    valid = false if (@props.max and value > @props.max)
    valid

  dateSelected: (value) ->
    valid = @isValid(value)

    if (not valid)
      value = @props.min or null

    date = new Date(value)
    @props.onChange(date)
    @setState({expandCalendar: false, valid: valid})

  onToggle: (open) ->
    @setState({expandCalendar: open})

  clickHandler: (event) ->
    if (event.target.tagName is "INPUT" and not @state.expandCalendar)
      @setState({expandCalendar: true})

  onBlur: (event) ->
    @setState({hasFocus: false})

  render: ->
    classes = ['form-control']
    wrapperClasses = ["form-control-wrapper", "tutor-input"]
    value = @props.value
    open = false

    if not @props.value and not @state.hasFocus
      classes.push('empty')

    if @state.expandCalendar and not @props.readOnly
      open = 'calendar'
      onToggle = @onToggle

    if @props.required then wrapperClasses.push('is-required')

    <div className={wrapperClasses.join(' ')}>
      <input type='text' disabled className={classes.join(' ')} />
      <div className="floating-label">{@props.label}</div>
      <div className="hint required-hint">
        Required Field <i className="fa fa-exclamation-circle"></i>
      </div>
      <DateTimePicker onClick={@clickHandler}
        onFocus={@expandCalendar}
        onBlur={@onBlur}
        id={@props.id}
        format='MMM dd, yyyy'
        time={false}
        calendar={true}
        open={open}
        onToggle={onToggle}
        className={classes.join(' ')}
        onChange={@dateSelected}
        readOnly={@props.readOnly}
        dayComponent={DayComponent}
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

  resize: (event) ->
    event.target.style.height = ''
    event.target.style.height = "#{event.target.scrollHeight}px"

  onChange: (event) ->
    @props.onChange(event.target?.value, event.target)

  render: ->
    classes = ['form-control']
    wrapperClasses = ["form-control-wrapper", "tutor-input"]

    unless @props.default then classes.push('empty')
    if @props.required then wrapperClasses.push('is-required')
    classes.push(@props.inputClass)

    <div className={wrapperClasses.join(' ')}>
      <textarea
        id={@props.inputId}
        ref='textarea'
        type='text'
        onKeyUp={@resize}
        onPaste={@resize}
        className={classes.join(' ')}
        defaultValue={@props.default}
        onChange={@onChange} />
      <div className="floating-label">{@props.label}</div>
      <div className="hint required-hint">
        Required Field <i className="fa fa-exclamation-circle"></i>
      </div>
    </div>

module.exports = {TutorInput, TutorDateInput, TutorTextArea}
