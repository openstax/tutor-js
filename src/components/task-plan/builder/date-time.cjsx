React  = require 'react'
moment = require 'moment-timezone'
BS     = require 'react-bootstrap'
_      = require 'underscore'

{TutorDateInput, TutorTimeInput} = require '../../tutor-input'
TimeHelper    = require '../../../helpers/time'
{AsyncButton} = require 'openstax-react-components'

DateTime = React.createClass

  propTypes:
    value:          React.PropTypes.string
    defaultValue:   React.PropTypes.string.isRequired
    isSetting:      React.PropTypes.func.isRequired
    timeLabel:      React.PropTypes.string.isRequired
    setDefaultTime: React.PropTypes.func.isRequired
    messageTime:    React.PropTypes.number

  getInitialState: ->
    @getStateFromProps(@props, @props.defaultValue)

  getDefaultProps: ->
    messageTime: 2000

  getStateFromProps: (props, time) ->
    props ?= @props
    {value, defaultValue, isSetting} = props

    date = moment(value).format(TimeHelper.ISO_DATE_FORMAT) if value?

    date: date
    time: defaultValue
    justSet: false
    isSetting: isSetting()
    isTimeValid: @isTimeValid(time)
    isTimeDefault: @isTimeDefault(time)

  onTimeChange: (time) ->
    @setState({time})

  onDateChange: (date) ->
    date = date.format(TimeHelper.ISO_DATE_FORMAT) if moment.isMoment(date)
    @setState({date})

  componentWillReceiveProps: (nextProps) ->
    nextState = @getStateFromProps(nextProps)
    @setState(nextState)

  componentDidUpdate: (prevProps, prevState) ->
    @onTimeUpdated() unless _.isEqual(_.pick(prevState, 'date', 'time'), _.pick(@state, 'date', 'time'))

    if @isJustSet(prevProps, prevState)
      {messageTime} = @props

      @setState(justSet: true)
      _.delay =>
        @setState(justSet: false, setClicked: null)
      , messageTime

  onTimeUpdated: ->
    {date, time} = @state

    if @hasValidInputs()
      dateTime = "#{date} #{time}"
      @props.onChange(dateTime)
    else
      @setState(isTimeValid: @isTimeValid(), isTimeDefault: @isTimeDefault())

  hasValidInputs: ->
    @isDateValid() and @isTimeValid()

  isJustSet: (prevProps, prevState) ->
    prevState.isSetting and
      not @state.isSetting and
      not prevProps.isTimeDefault and
      @props.isTimeDefault

  isDateValid: ->
    @state?.date? and _.isEmpty(@refs?.date?.state?.errors)

  isTimeValid: (time) ->
    time ?= @state?.time

    time? and _.isEmpty(@refs?.time?.refs?.timeInput?.state?.errors)

  isTimeDefault: (time) ->
    time ?= @state?.time
    return true if _.isUndefined(time)
    {defaultTime} = @props
    TimeHelper.makeMoment(time, 'HH:mm').isSame(TimeHelper.makeMoment(defaultTime, 'HH:mm'), 'minute')

  setDefaultTime: ->
    {timeLabel, setDefaultTime} = @props
    {time} = @state

    timeChange = {}
    timeChange[timeLabel] = time
    @setState(setClicked: true)

    setDefaultTime(timeChange)

  render: ->
    {label, taskingIdentifier} = @props
    {isSetting, isTimeValid, justSet, setClicked, isTimeDefault} = @state

    type = label.toLowerCase()

    timeProps = _.omit(@props, 'value', 'onChange', 'label')
    dateProps = _.omit(@props, 'defaultValue', 'onChange', 'label')

    timeProps.label = "#{label} Time"
    dateProps.label = "#{label} Date"

    if not isTimeDefault and isTimeValid
      setAsDefaultExplanation = <BS.Popover id="tasking-datetime-default-tip-#{label}-#{taskingIdentifier}">
        {label} times for assignments created from now on will have this time set as the default.
      </BS.Popover>

      setAsDefaultOption = <AsyncButton
        className='tasking-time-default'
        bsStyle='link'
        waitingText='Saving…'
        isWaiting={isSetting and setClicked}
        onClick=@setDefaultTime>
          Set as default
          <BS.OverlayTrigger placement='top' overlay={setAsDefaultExplanation}>
            <i className='fa fa-info-circle'></i>
          </BS.OverlayTrigger>
      </AsyncButton>
    else if justSet
      setAsDefaultOption = <span className='tasking-time-default tasking-time-default-set'>
        Default set.
      </span>


    <BS.Col xs=12 md=6>
      <BS.Row>
        <BS.Col xs=8 md=7 className="tasking-date -assignment-#{type}-date">
          <TutorDateInput {...dateProps} onChange={@onDateChange} ref='date'/>
        </BS.Col>
        <BS.Col xs=4 md=5 className="tasking-time -assignment-#{type}-time">
          <TutorTimeInput {...timeProps} onChange={@onTimeChange} onUpdated={@onTimeUpdated} ref='time'/>
          {setAsDefaultOption}
        </BS.Col>
      </BS.Row>
    </BS.Col>

module.exports = DateTime
