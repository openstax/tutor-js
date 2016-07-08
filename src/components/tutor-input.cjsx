React = require 'react/addons'
BS = require 'react-bootstrap'
moment = require 'moment-timezone'
_ = require 'underscore'
classnames = require 'classnames'
MaskedInput = require 'react-maskedinput'

{TimeStore} = require '../flux/time'
TimeHelper = require '../helpers/time'
S = require '../helpers/string'
TutorDateFormat = TimeStore.getFormat()

DatePicker = require 'react-datepicker'
TutorErrors = require './tutor-errors'

TutorInput = React.createClass
  propTypes:
    label: React.PropTypes.node.isRequired
    id: React.PropTypes.string
    className: React.PropTypes.string
    type: React.PropTypes.string
    onChange: React.PropTypes.func
    validate: React.PropTypes.func
    onUpdated: React.PropTypes.func

  getDefaultProps: ->
    validate: (inputValue) ->
      return ['required'] unless (inputValue? and inputValue.length > 0)
    type: 'text'

  getInitialState: ->
    errors = @props.validate(@props.default)
    errors: errors or []

  componentDidUpdate: (prevProps, prevState) ->
    @props.onUpdated?(@state) unless _.isEqual(prevState, @state)

  onChange: (event) ->
    # TODO make this more intuitive to parent elements
    @props.onChange(event.target?.value, event.target, event)
    @validate(event.target?.value)

  validate: (inputValue) ->
    errors = @props.validate(inputValue)
    errors ?= []
    @setState({errors})

  focus: ->
    React.findDOMNode(@refs.input)?.focus()

  cursorToEnd: ->
    input = React.findDOMNode(@refs.input)
    input.selectionStart = input.selectionEnd = input.value.length

  # The label has style "pointer-events: none" set.  Unfortunantly IE 10
  # doesn't support that and refuses to pass the click through the label into the input
  # We help it out here by manually focusing when then label is clicked
  # (which should only happen on IE 10)
  forwardLabelClick: -> @focus()

  render: ->
    {children} = @props
    classes = classnames 'form-control', @props.class,
      empty: not (@props.default or @props.defaultValue)

    wrapperClasses = classnames 'form-control-wrapper', 'tutor-input', @props.className,
      'is-required': @props.required
      'has-error': @state.errors?.length

    errors = _.map(@state.errors, (error) ->
      return unless TutorErrors[error]?
      ErrorWarning = TutorErrors[error]
      <ErrorWarning key={error}/>
    )

    inputProps = _.omit(@props, 'label', 'className', 'onChange', 'validate', 'default', 'children', 'ref')
    inputProps.ref = 'input'
    inputProps.className = classes
    inputProps.onChange = @onChange
    inputProps.defaultValue ?= @props.default if @props.default?

    if children?
      inputBox = React.addons.cloneWithProps(children, inputProps)
    else
      inputBox = <input {...inputProps}/>


    # Please do not set value={@props.value} on input.
    #
    # Because we are updating the store in some cases on change, and
    # the store is providing the @props.value being passed in here,
    # the cursor for typing in this input could be forced to move to the
    # right when the input re-renders since the props have changed.
    #
    # Instead, use @props.default to set an intial defaul value.
    <div className={wrapperClasses}>
      {inputBox}
      <div className='floating-label' onClick={@forwardLabelClick}>{@props.label}</div>
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
    return false unless moment.isMoment(value)
    valid = true
    valid = false if (@props.min and value.isBefore(@props.min, 'day'))
    valid = false if (@props.max and value.isAfter(@props.max, 'day'))
    valid

  dateSelected: (value) ->
    valid = @isValid(value)

    unless valid
      value = TimeHelper.getMomentPreserveDate(@props.min) or null
      errors = ['Invalid date']


    value = TimeHelper.getMomentPreserveDate(value)

    @props.onChange(value)
    @setState({expandCalendar: false, valid, value, errors})

  # TODO There's a bug in our version of datepicker where onBlur fires when
  #   changing months.  Put this onBlur back as a prop for Datepicker when
  #   we upgrade so that label and invalid date errors can display properly
  #   on blur.
  onBlur: ->
    @setState({hasFocus: false})

  getValue: ->
    @props.value or @state.value

  render: ->
    classes = classnames 'form-control',
      empty: (not @props.value and not @state.hasFocus)


    wrapperClasses = classnames 'form-control-wrapper', 'tutor-input', '-tutor-date-input', @props.className,
      'is-required': @props.required
      'has-error': @state.errors?.length
      'disabled-datepicker':  isDatePickerDisabled

    now = TimeStore.getNow()
    value = @props.value

    value = if value
      TimeHelper.getMomentPreserveDate(value)
    else
      null

    isDatePickerDisabled = @props.disabled and value
    min = if @props.min then moment(@props.min) else moment(now).subtract(10, 'years')
    max = if @props.max then moment(@props.max) else moment(now).add(10, 'years')

    if not @props.disabled
      dateElem = <DatePicker
          readOnly={true}
          minDate={min}
          maxDate={max}
          onFocus={@expandCalendar}
          dateFormat={TutorDateFormat}
          key={@props.id}
          ref="picker"
          className={classes}
          onChange={@dateSelected}
          disabled={@props.disabled}
          selected={value}
          weekStart={"#{@props.currentLocale.week.dow}"}
        />
    else if isDatePickerDisabled
      displayValue = value.format(TutorDateFormat)

    displayOnlyProps =
      type: 'text'
      disabled: true
      readOnly: true
      className: classes
      value: displayValue

    <div className={wrapperClasses}>
      <input {...displayOnlyProps}/>
      <div className="floating-label">{@props.label}</div>
      <div className="hint required-hint">
        Required Field <i className="fa fa-exclamation-circle"></i>
      </div>


      <div className="date-wrapper">
        {dateElem}
        <i className="fa fa-calendar"></i>
      </div>
    </div>

TutorTimeInput = React.createClass
  getDefaultProps: ->
    fromMomentFormat: TimeHelper.ISO_TIME_FORMAT
    toMomentFormat: TimeHelper.HUMAN_TIME_FORMAT
    formatCharacters:
      i: validate: (char) -> /([0-2]|:)/.test(char)
      h: validate: (char) -> /[0-9]/.test(char)
      H: validate: (char) -> /[0-1]/.test(char)
      M: validate: (char) -> /[0-5]/.test(char)
      m: validate: (char) -> /[0-9]/.test(char)
      P:
        validate: (char) -> /(A|P|a|p)/.test(char)
        transform: (char) -> "#{char}m".toLowerCase()

  getInitialState: ->
    {defaultValue} = @props
    timeValue = @timeIn(defaultValue)

    timeValue: timeValue
    initialTimeValue: timeValue
    timePattern: @getPatternFromValue(timeValue)

  timeIn: (value) ->
    {fromMomentFormat, toMomentFormat} = @props
    moment(value, fromMomentFormat).format(toMomentFormat)

  timeOut: (value) ->
    {fromMomentFormat, toMomentFormat} = @props
    moment(value, toMomentFormat).format(fromMomentFormat)

  getInput: ->
    @refs.timeInput?.refs.input

  getMask: ->
    @getInput()?.mask

  getValue: ->
    @getMask()?.getValue()

  getRawValue: ->
    @getMask()?.getRawValue()

  validate: (inputValue) ->
    unless _.isUndefined(inputValue)
      ['incorrectTime'] if inputValue.indexOf(@getMask()?.placeholderChar) > -1

  isColon: (changeEvent) ->
    KEY_CODE =
      shiftKey: true
      charCode: 58

    _.isEqual(_.pick(changeEvent, _.keys(KEY_CODE)), KEY_CODE)

  shouldShrinkMask: (changeEvent) ->
    @isColon(changeEvent)

  isCursor: ->
    {selection} = @getMask()
    (selection.end - selection.start) is 0

  getUpdates: (timePattern, timeValue) ->
    cursorChange =  timePattern.length - @state.timePattern.length
    {selection} = @getMask()
    selection = _.clone(selection)

    if /^(_+[1-9])/.test(timeValue)
      timeValue = S.removeAt(timeValue, 0)
      selection.start = 2
      selection.end = 2

    else if cursorChange > 0
      timeValue = S.insertAt(timeValue, 1, @getMask()?.placeholderChar)
      selection.start = 1
      selection.end = 1

    else if cursorChange < 0
      timeValue = S.removeAt(timeValue, 1)
      selection.start = 2
      selection.end = 2

    {timeValue, selection}

  onChange: (value, input, changeEvent) ->
    timePattern = @getPatternFromValue(value, changeEvent)
    time = @getValue()

    {timeValue, selection} = @getUpdates(timePattern, time)
    nextState =
      selection: undefined
    nextState.timePattern = timePattern if timePattern isnt @state.timePattern
    nextState.timeValue = timeValue if timeValue isnt @state.timeValue
    nextState.selection = selection unless _.isEqual(@getMask().selection, selection)

    @setState(nextState)

    if @isValidTime(timeValue)
      timeValue = @timeOut(timeValue)

    @props.onChange?(timeValue)

  componentDidUpdate: (prevProps, prevState) ->
    @getMask()?.setValue(@state.timeValue) if @state.timeValue isnt prevState.timeValue
    if @state.selection? and not _.isEqual(@getMask()?.selection, @state.selection)
      # update cursor to expected time, doesnt quite work for some reason for expanding mask
      _.defer =>
        @getMask()?.setSelection(@state.selection)
        @getInput()?._updateInputSelection()

    @refs.timeInput.validate(@state.timeValue)

  getPatternFromValue: (value, changeEvent) ->
    if /^([2-9])/.test(value) or /^(_+[1-9])/.test(value)
      patten = 'h:Mm P'
    else if /^1:/.test(value)
      if changeEvent? and not @shouldShrinkMask(changeEvent)
        pattern = 'hh:Mm P'
      else
        pattern = 'h:Mm P'
    else
      pattern = 'hi:Mm P'

  isValidTime: (value) ->
    not /_/.test(value)

  render: ->
    maskedProps = _.omit(@props, 'defaultValue', 'onChange')

    {formatCharacters} = @props
    {timePattern, timeValue} = @state

    <TutorInput
      {...maskedProps}
      value={timeValue}
      defaultValue={timeValue}
      onChange={@onChange}
      validate={@validate}
      ref="timeInput"
      mask={timePattern}
      formatCharacters={formatCharacters}
      size='8'
      name='time'>
      <MaskedInput/>
    </TutorInput>

TutorTextArea = React.createClass
  propTypes:
    label: React.PropTypes.string.isRequired
    id: React.PropTypes.string
    className: React.PropTypes.string
    onChange: React.PropTypes.func

  resize: (event) ->
    textarea = @refs.textarea.getDOMNode()
    textarea.style.height = ''
    textarea.style.height = "#{textarea.scrollHeight}px"

  componentDidMount: ->
    @resize() if @props.default?.length > 0

  onChange: (event) ->
    @props.onChange(event.target?.value, event.target)

  focus: ->
    React.findDOMNode(@refs.textarea)?.focus()

  # Forward clicks on for IE10.  see comments on TutorInput
  forwardLabelClick: -> @focus()

  render: ->
    classes = classnames 'form-control', @props.inputClass,
      empty: not @props.default

    wrapperClasses = classnames "form-control-wrapper", "tutor-input", @props.className,
      'is-required': @props.required

    <div className={wrapperClasses}>
      <textarea
        id={@props.inputId}
        ref='textarea'
        type='text'
        onKeyUp={@resize}
        onPaste={@resize}
        className={classes}
        defaultValue={@props.default}
        disabled={@props.disabled}
        onChange={@onChange} />
      <div className="floating-label" onClick={@forwardLabelClick}>{@props.label}</div>
      <div className="hint required-hint">
        Required Field <i className="fa fa-exclamation-circle"></i>
      </div>
    </div>

# TODO: replace with new and improved BS.Radio when we update
TutorRadio = React.createClass

  propTypes:
    value: React.PropTypes.string.isRequired
    id: React.PropTypes.string.isRequired
    name: React.PropTypes.string.isRequired
    label: React.PropTypes.string
    className: React.PropTypes.string
    onChange: React.PropTypes.func
    checked: React.PropTypes.bool
    disabled: React.PropTypes.bool

  isChecked: ->
    @refs.radio.getDOMNode().checked

  handleChange: (changeEvent) ->
    {value} = @props

    @props.onChange?(changeEvent, {value})

  render: ->
    {label, className, value, id, checked} = @props
    inputProps = _.pick(@props, 'value', 'id', 'name', 'checked', 'disabled')

    label ?= value
    classes = classnames 'tutor-radio', className,
      active: checked

    <div className={classes}>
      <input ref='radio' {...inputProps} type='radio' onChange={@handleChange}/>
      <label htmlFor={id}>{label}</label>
    </div>

module.exports = {TutorInput, TutorDateInput, TutorDateFormat, TutorTimeInput, TutorTextArea, TutorRadio}
