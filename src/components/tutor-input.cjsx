React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment'
_ = require 'underscore'

{TimeStore} = require '../flux/time'
DatePicker = require 'react-datepicker'
TutorErrors = require './tutor-errors'

TutorInput = React.createClass
  propTypes:
    label: React.PropTypes.string.isRequired
    id: React.PropTypes.string
    className: React.PropTypes.string
    type: React.PropTypes.string
    onChange: React.PropTypes.func
    value: React.PropTypes.any
    validate: React.PropTypes.func

  getDefaultProps: ->
    validate: (inputValue) ->
      return ['required'] unless (inputValue? and inputValue.length > 0)

  getInitialState: ->
    errors = @props.validate(@props.value)
    errors: errors or []

  onChange: (event) ->
    @props.onChange(event.target?.value, event.target)
    @validate(event.target?.value)

  validate: (inputValue) ->
    errors = @props.validate(inputValue)
    errors ?= []
    @setState({errors})

  focus: ->
    React.findDOMNode(@refs.input)?.focus()

  render: ->
    classes = ['form-control']
    wrapperClasses = ["form-control-wrapper", "tutor-input"]
    wrapperClasses.push(@props.className) if @props.className

    unless @props.default or @props.value then classes.push('empty')
    if @props.required then wrapperClasses.push('is-required')
    wrapperClasses.push('has-error') if @state.errors.length

    classes.push(@props.class)

    errors = _.map(@state.errors, (error) ->
      return unless TutorErrors[error]?
      errorWarning = TutorErrors[error]
      <errorWarning key={error}/>
    )

    <div className={wrapperClasses.join(' ')}>
      <input
        id={@props.id}
        ref="input"
        type='text'
        className={classes.join(' ')}
        value={@props.value}
        defaultValue={@props.default}
        onChange={@onChange}
      />
      <div className="floating-label">{@props.label}</div>
      {errors}
    </div>

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

    date = value.format("MM/DD/YYYY")
    @props.onChange(date)
    @setState({expandCalendar: false, valid: valid, value: date})

  getValue: ->
    @props.value or @state.value

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

    now = TimeStore.getNow()
    value = @props.value
    value = if value and value.getTime and not isNaN(value.getTime())
      new moment(value)
    else
      null
    min = if @props.min then new moment(@props.min) else new moment(now).subtract(10, 'years')
    max = if @props.max then new moment(@props.max) else new moment(now).add(10, 'years')

    if not @props.value and not @state.hasFocus
      classes.push('empty')

    if @state.expandCalendar and not @props.readOnly
      onToggle = @onToggle

    if @props.required then wrapperClasses.push('is-required')
    if not @props.disabled
      dateElem = <DatePicker
          minDate={min}
          maxDate={max}
          onFocus={@expandCalendar}
          dateFormat="MM/DD/YYYY"
          onBlur={@onBlur}
          key={@props.id}
          ref="picker"
          className={classes.join(' ')}
          onChange={@dateSelected}
          disabled={@props.disabled}
          selected={value}
          weekStart={0}
        />
    else if @props.disabled and value
      displayValue = value.toString("MM/DD/YYYY")

    <div className={wrapperClasses.join(' ')}>
      <input type='text' disabled className={classes.join(' ')} value={displayValue}/>
      <div className="floating-label">{@props.label}</div>
      <div className="hint required-hint">
        Required Field <i className="fa fa-exclamation-circle"></i>
      </div>


      <div className="date-wrapper">
        {dateElem}
        <i className="fa fa-calendar"></i>
      </div>
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
    wrapperClasses.push(@props.className) if @props.className
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
