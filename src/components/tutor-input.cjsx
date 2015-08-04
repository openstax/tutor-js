React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment'
_ = require 'underscore'

{TimeStore} = require '../flux/time'
TimeHelper = require '../helpers/time'

DatePicker = require 'react-datepicker'
TutorErrors = require './tutor-errors'
TutorDateFormat = "MM/DD/YYYY"

TutorInput = React.createClass
  propTypes:
    label: React.PropTypes.string.isRequired
    id: React.PropTypes.string
    className: React.PropTypes.string
    type: React.PropTypes.string
    onChange: React.PropTypes.func
    validate: React.PropTypes.func

  getDefaultProps: ->
    validate: (inputValue) ->
      return ['required'] unless (inputValue? and inputValue.length > 0)
    type: 'text'

  getInitialState: ->
    errors = @props.validate(@props.default)
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

    unless @props.default then classes.push('empty')
    if @props.required then wrapperClasses.push('is-required')
    wrapperClasses.push('has-error') if @state.errors.length

    classes.push(@props.class)

    errors = _.map(@state.errors, (error) ->
      return unless TutorErrors[error]?
      errorWarning = TutorErrors[error]
      <errorWarning key={error}/>
    )

    inputProps = _.omit(@props, 'label', 'className', 'onChange', 'validate', 'default', 'value')

    # Please do not set value={@props.value} on input.
    #
    # Because we are updating the store in some cases on change, and
    # the store is providing the @props.value being passed in here,
    # the cursor for typing in this input could be forced to move to the
    # right when the input re-renders since the props have changed.
    #
    # Instead, use @props.default to set an intial defaul value.
    <div className={wrapperClasses.join(' ')}>
      <input
        {...inputProps}
        ref='input'
        className={classes.join(' ')}
        defaultValue={@props.default}
        onChange={@onChange}
      />
      <div className='floating-label'>{@props.label}</div>
      {errors}
    </div>

TutorDateInput = React.createClass
  displayName: 'TutorDateInput'
  propTypes:
    currentLocale: React.PropTypes.shape(
      abbr: React.PropTypes.string
      week: React.PropTypes.object
      weekdaysMin: React.PropTypes.array
    )

  getDefaultProps: ->
    currentLocale = TimeHelper.getCurrentLocales()
    {currentLocale}

  getInitialState: ->
    expandCalendar: false

  # For some reason, react-datepicker chooses to GLOBALLY override moment's locale.
  # This tends to do nasty things to the dashboard calendar.
  # Therefore, grab the current locale settings, and restore them when unmounting.
  # TODO: debug react-datepicker and submit a PR so that it will no longer thrash moment's global.
  componentWillUnmount: ->
    @restoreLocales()

  restoreLocales: ->
    {abbr} = @props.currentLocale

    localeOptions = _.omit(@props.currentLocale, 'abbr')
    moment.locale(abbr, localeOptions)

  expandCalendar: ->
    @setState({expandCalendar: true, hasFocus: true})

  isValid: (value) ->
    valid = true
    valid = false if (@props.min and value.isBefore(@props.min, 'day'))
    valid = false if (@props.max and value.isAfter(@props.max, 'day'))
    valid

  dateSelected: (value) ->
    valid = @isValid(value)

    if (not valid)
      value = moment(@props.min) or null

    date = value.format(TutorDateFormat)
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
    wrapperClasses = ["form-control-wrapper", "tutor-input", '-tutor-date-input']
    wrapperClasses.push(@props.className) if @props.className

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

    if @props.required then wrapperClasses.push('is-required')
    if not @props.disabled
      dateElem = <DatePicker
          minDate={min}
          maxDate={max}
          onFocus={@expandCalendar}
          dateFormat={TutorDateFormat}
          onBlur={@onBlur}
          key={@props.id}
          ref="picker"
          className={classes.join(' ')}
          onChange={@dateSelected}
          disabled={@props.disabled}
          selected={value}
          weekStart={@props.currentLocale.week.dow}
        />
    else if @props.disabled and value
      displayValue = value.format(TutorDateFormat)
      wrapperClasses.push('disabled-datepicker')

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

module.exports = {TutorInput, TutorDateInput, TutorDateFormat, TutorTextArea}
