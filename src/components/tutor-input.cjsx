React = require 'react/addons'
BS = require 'react-bootstrap'
moment = require 'moment-timezone'
_ = require 'underscore'
classnames = require 'classnames'
MaskedInput = require 'react-input-mask'

{TimeStore} = require '../flux/time'
TimeHelper = require '../helpers/time'
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

    inputProps = _.omit(@props, 'label', 'className', 'onChange', 'validate', 'default', 'value', 'children')
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
    valid = true
    valid = false if (@props.min and value.isBefore(@props.min, 'day'))
    valid = false if (@props.max and value.isAfter(@props.max, 'day'))
    valid

  dateSelected: (value) ->
    valid = @isValid(value)

    if (not valid)
      value = moment(@props.min) or null

    value = TimeHelper.getZonedMoment(value)

    @props.onChange(value)
    @setState({expandCalendar: false, valid, value})

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
          minDate={min}
          maxDate={max}
          onFocus={@expandCalendar}
          dateFormat={TutorDateFormat}
          onBlur={@onBlur}
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

    <div className={wrapperClasses}>
      <input type='text' disabled className={classes} value={displayValue}/>
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
    formatChars:
      h: '[0-9]'
      H: '[0-1]'
      M: '[0-6]'
      m: '[0-9]'
      P: '(A|P|a|p)'
      p: '(M|m)'
    fromMomentFormat: 'HH:mm'
    toMomentFormat: 'hh:mm a'

  timeIn: (value) ->
    {fromMomentFormat, toMomentFormat} = @props
    moment(value, fromMomentFormat).format(toMomentFormat)

  timeOut: (value) ->
    {fromMomentFormat, toMomentFormat} = @props
    moment(value, toMomentFormat).format(fromMomentFormat)

  getDefaultValue: ->
    {defaultValue} = @props
    @timeIn(defaultValue)

  onChange: ->
    time = @refs.timeInput.refs.input.formatValue(@refs.timeInput.refs.input.refs.input.getDOMNode().value)
    outputTime = @timeOut(time)
    @props.onChange?(outputTime)

  render: ->
    defaultValue = @getDefaultValue()
    maskedProps = _.omit(@props, 'defaultValue', 'onChange')

    <TutorInput
      {...maskedProps}
      defaultValue={defaultValue}
      onChange={@onChange}
      ref="timeInput"
      mask='Hh:Mm Pp'
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

module.exports = {TutorInput, TutorDateInput, TutorDateFormat, TutorTimeInput, TutorTextArea}
