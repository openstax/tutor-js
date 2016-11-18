React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment'

{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'

CourseCalendarTitleNav = React.createClass

  displayName: 'CourseCalendarTitleNav'

  propTypes:
    setDate: React.PropTypes.func
    date: TimeHelper.PropTypes.moment
    format: React.PropTypes.string.isRequired

  getInitialState: ->
    date: @props.date or moment(TimeStore.getNow())

  getDefaultProps: ->
    duration: 'month'
    format: 'MMMM YYYY'

  componentWillReceiveProps: (nextProps) ->
    unless moment(nextProps.date).isSame(@state.date, 'month')
      @setState(date: nextProps.date)

  componentDidUpdate: ->
    {setDate} = @props
    setDate?(@state.date)

  handleNavigate: (subtractOrAdd, clickEvent) ->
    {duration, setDate} = @props
    date = @state.date.clone()[subtractOrAdd](1, duration)
    clickEvent.preventDefault()
    @setState({date})

  handleNext: (clickEvent) ->
    @handleNavigate('add', clickEvent)

  handlePrevious: (clickEvent) ->
    @handleNavigate('subtract', clickEvent)

  render: ->
    <div className='calendar-header-navigation'>

      <div className='calendar-header-label'>
        <a href='#' className='calendar-header-control previous' onClick={@handlePrevious}>
          <i className='fa fa-caret-left'></i>
        </a>
        {@state.date.format(@props.format)}
        <a href='#' className='calendar-header-control next' onClick={@handleNext}>
          <i className='fa fa-caret-right'></i>
        </a>
      </div>

    </div>

module.exports = CourseCalendarTitleNav
