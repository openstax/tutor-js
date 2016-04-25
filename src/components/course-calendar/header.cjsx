moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'
{ Link } = require 'react-router'

CourseAddMenuMixin = require './add-menu-mixin'
PracticeButton = require '../buttons/practice-button'
BrowseTheBook = require '../buttons/browse-the-book'

{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'

CourseCalendarHeader = React.createClass
  displayName: 'CourseCalendarHeader'

  propTypes:
    duration: React.PropTypes.oneOf(['month', 'week', 'day']).isRequired
    setDate: React.PropTypes.func
    date: TimeHelper.PropTypes.moment
    format: React.PropTypes.string.isRequired

  mixins: [ CourseAddMenuMixin ]

  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  getDefaultProps: ->
    duration: 'month'
    format: 'MMMM YYYY'

  getInitialState: ->
    date: @props.date or moment(TimeStore.getNow())

  componentDidUpdate: ->
    {setDate} = @props
    setDate?(@state.date)

  componentWillReceiveProps: (nextProps) ->
    unless moment(nextProps.date).isSame(@state.date, 'month')
      @setState(date: nextProps.date)

  handleNavigate: (subtractOrAdd, clickEvent) ->
    {duration, setDate} = @props
    clickEvent.preventDefault()
    @setState(
      date: @state.date.clone()[subtractOrAdd](1, duration)
    )

  handleNext: (clickEvent) ->
    @handleNavigate('add', clickEvent)

  handlePrevious: (clickEvent) ->
    @handleNavigate('subtract', clickEvent)

  render: ->
    {date} = @state
    {format, duration} = @props
    {courseId} = @context.params
    <div className='calendar-header'>
      <BS.Row className='calendar-actions'>
        <BrowseTheBook bsStyle='default' courseId={courseId} />
        <Link className='btn btn-default' to="/courses/#{courseId}/t/guide">
          Performance Forecast
        </Link>
        <Link className='btn btn-default' to="/courses/#{courseId}/t/scores/?">
          Student Scores
        </Link>
      </BS.Row>
      <BS.Row>
        <BS.Col xs={4}>
          <BS.DropdownButton
            id='add-assignment'
            className='add-assignment'
            title='Add Assignment'
            bsStyle='primary'>
            {@renderAddActions()}
            </BS.DropdownButton>
        </BS.Col>
        <BS.Col xs={4} className='calendar-header-label'>
          <a href='#' className='calendar-header-control previous' onClick={@handlePrevious}>
            <i className='fa fa-caret-left'></i>
          </a>
          {date.format(format)}
          <a href='#' className='calendar-header-control next' onClick={@handleNext}>
            <i className='fa fa-caret-right'></i>
          </a>
        </BS.Col>
      </BS.Row>
    </div>


module.exports = CourseCalendarHeader
