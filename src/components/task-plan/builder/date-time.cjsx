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

  getInitialState: ->
    @getStateFromProps()

  getStateFromProps: (props) ->
    props ?= @props
    {value, defaultValue, isSetting} = props

    date = moment(value).format(TimeHelper.ISO_DATE_FORMAT) if value?

    date: date
    time: defaultValue
    isSetting: isSetting()

  onTimeChange: (time) ->
    @setState({time})

  onDateChange: (date) ->
    date = date.format(TimeHelper.ISO_DATE_FORMAT) if moment.isMoment(date)
    @setState({date})

  componentWillReceiveProps: (nextProps) ->
    nextState = @getStateFromProps(nextProps)
    @setState(nextState)

  componentDidUpdate: (prevProps, prevState) ->
    {date, time} = @state

    if @hasValidInputs() and not _.isEqual(prevState, @state)
      dateTime = "#{date} #{time}"
      @props.onChange(dateTime)

  hasValidInputs: ->
    _.isEmpty(@refs.date?.state?.errors) and _.isEmpty(@refs.time?.refs.timeInput?.state?.errors)

  canSetAsDefaultTime: ->
    _.isEmpty @refs.time?.refs.timeInput?.state?.errors

  setDefaultTime: ->
    {timeLabel, setDefaultTime} = @props
    {time} = @state

    timeChange = {}
    timeChange[timeLabel] = time

    setDefaultTime(timeChange)

  render: ->
    {isTimeDefault, label, taskingIdentifier} = @props
    {isSetting} = @state

    type = label.toLowerCase()

    timeProps = _.omit(@props, 'value', 'onChange', 'label')
    dateProps = _.omit(@props, 'defaultValue', 'onChange', 'label')

    timeProps.label = "#{label} Time"
    dateProps.label = "#{label} Date"

    if not isTimeDefault and @canSetAsDefaultTime()
      setAsDefaultExplanation = <BS.Popover id="tasking-datetime-default-tip-#{label}-#{taskingIdentifier}">
        {label} times for assignments created from now on will have this time set as the default.
      </BS.Popover>

      setAsDefault = <AsyncButton
        className='tasking-time-default'
        bsStyle='link'
        waitingText='Saving…'
        isWaiting={isSetting}
        onClick=@setDefaultTime>
        Set as default
        <BS.OverlayTrigger placement='top' overlay={setAsDefaultExplanation}>
          <i className="fa fa-info-circle"></i>
        </BS.OverlayTrigger>
      </AsyncButton>

    <BS.Col xs=12 md=6>
      <BS.Row>
        <BS.Col xs=8 md=7 className="tasking-date -assignment-#{type}-date">
          <TutorDateInput {...dateProps} onChange={@onDateChange} ref='date'/>
        </BS.Col>
        <BS.Col xs=4 md=5 className="tasking-time -assignment-#{type}-time">
          <TutorTimeInput {...timeProps} onChange={@onTimeChange} ref='time'/>
          {setAsDefault}
        </BS.Col>
      </BS.Row>
    </BS.Col>

module.exports = DateTime
