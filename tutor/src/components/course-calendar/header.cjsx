moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

CourseAddMenuMixin = require './add-menu-mixin'
BrowseTheBook = require '../buttons/browse-the-book'
NoPeriods = require '../no-periods'

{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'

CourseCalendarHeader = React.createClass
  displayName: 'CourseCalendarHeader'

  propTypes:
    duration: React.PropTypes.oneOf(['month', 'week', 'day']).isRequired
    setDate: React.PropTypes.func
    date: TimeHelper.PropTypes.moment
    format: React.PropTypes.string.isRequired
    hasPeriods: React.PropTypes.bool.isRequired

  mixins: [ CourseAddMenuMixin ]

  contextTypes:
    router: React.PropTypes.func

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
    date = @state.date.clone()[subtractOrAdd](1, duration)
    clickEvent.preventDefault()
    @setState({date})


  handleNext: (clickEvent) ->
    @handleNavigate('add', clickEvent)

  handlePrevious: (clickEvent) ->
    @handleNavigate('subtract', clickEvent)

  render: ->
    {date} = @state
    {format, duration, hasPeriods} = @props
    {courseId} = @context.router.getCurrentParams()

    addAssignmentBSStyle = if hasPeriods then 'primary' else 'default'

    <div className='calendar-header'>
      <BS.Row className='calendar-header-actions'>
        {<NoPeriods
          courseId={courseId}
          noPanel={true}/> unless hasPeriods}

        <div className='calendar-header-actions-buttons'>
          <BrowseTheBook bsStyle='default' courseId={courseId} />
          <Router.Link
            className='btn btn-default'
            to='viewTeacherPerformanceForecast'
            params={{courseId}}>
            Performance Forecast
          </Router.Link>
          <Router.Link className='btn btn-default' to='viewScores' params={{courseId}}>
            Student Scores
          </Router.Link>
        </div>
      </BS.Row>
      <BS.Row className='calendar-header-navigation'>
        <BS.Col xs={4}>
          <BS.DropdownButton
            ref='addAssignmentButton'
            id='add-assignment'
            className='add-assignment'
            title='Add Assignment'
            bsStyle={addAssignmentBSStyle}>
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
