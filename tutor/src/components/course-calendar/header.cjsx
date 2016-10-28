React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'
{DragSource} = require 'react-dnd'

{TimeStore} = require '../../flux/time'
{ItemTypes, NewTaskDrag, DragInjector} = require './task-dnd'
TimeHelper = require '../../helpers/time'

TutorLink = require '../link'
CourseAddMenuMixin = require './add-menu-mixin'
BrowseTheBook = require '../buttons/browse-the-book'
NoPeriods = require '../no-periods'

MenuLink = (props) ->
  <li
    data-assignment-type={props.link.type}
  >
    {props.connectDragSource(
      <a

        href={props.link.pathname}
        onClick={_.partial(props.goToBuilder, props.link)} >
        {props.link.text}
      </a>
    )}
  </li>

DnDMenuLink = DragSource(ItemTypes.NewTask, NewTaskDrag, DragInjector)(MenuLink)

CourseCalendarHeader = React.createClass
  displayName: 'CourseCalendarHeader'

  propTypes:
    duration: React.PropTypes.oneOf(['month', 'week', 'day']).isRequired
    setDate: React.PropTypes.func
    date: TimeHelper.PropTypes.moment
    format: React.PropTypes.string.isRequired
    hasPeriods: React.PropTypes.bool.isRequired
    onCopyPreviousAssignment: React.PropTypes.func.isRequired

  mixins: [ CourseAddMenuMixin ]


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

  renderMenuLink: (link) ->
    <DnDMenuLink key={link.type} link=link goToBuilder={@goToBuilder} />

  render: ->
    {date} = @state
    {courseId, format, duration, hasPeriods} = @props

    addAssignmentBSStyle = if hasPeriods then 'primary' else 'default'

    <div className='calendar-header'>
      <BS.Row className='calendar-header-actions'>
        {<NoPeriods
          courseId={courseId}
          noPanel={true}
        /> unless hasPeriods}

          <BS.DropdownButton
            ref='addAssignmentButton'
            id='add-assignment'
            className='add-assignment'
            title='Add Assignment'
            bsStyle={addAssignmentBSStyle}
          >
            {@renderAddActions()}

          </BS.DropdownButton>

        <div className='calendar-header-actions-buttons'>

          <BrowseTheBook bsStyle='default' courseId={courseId} />
          <TutorLink
            className='btn btn-default'
            to='viewPerformanceGuide'
            params={{courseId}}
          >
            Performance Forecast
          </TutorLink>
          <TutorLink className='btn btn-default'
            to='viewScores'
            params={{courseId}}
          >
            Student Scores
          </TutorLink>
        </div>
      </BS.Row>
      <BS.Row className='calendar-header-navigation'>
        <BS.Col xs={6} xsOffset={3} className='calendar-header-label'>
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
