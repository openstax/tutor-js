React = require 'react'
BS = require 'react-bootstrap'
LoadableItem = require './loadable-item'
_ = require 'underscore'
camelCase = require 'camelcase'
classnames = require 'classnames'

{CourseActions, CourseStore} = require '../flux/course'
PeriodHelper = require '../helpers/period'

CoursePeriodsNav = React.createClass
  displayName: 'CoursePeriodsNav'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    handleSelect: React.PropTypes.func
    handleKeyUpdate: React.PropTypes.func
    initialActive: React.PropTypes.number.isRequired
    periods: React.PropTypes.array.isRequired
    afterTabsItem: React.PropTypes.func


  getDefaultProps: ->
    initialActive: 0
    sortedPeriods: []

  getInitialState: ->
    active: @props.initialActive

  componentWillMount: ->
    @setSortedPeriods(@props.periods)
    CourseStore.on('course.loaded', @selectPeriod)

  componentWillUnmount: ->
    CourseStore.off('course.loaded', @selectPeriod)

  componentWillReceiveProps: (nextProps) ->
    @setSortedPeriods(nextProps.periods)

  setSortedPeriods: (periods) ->
    # make sure that periods are sorted by name
    sortedPeriods = PeriodHelper.sort(periods)
    @setState(sortedPeriods: sortedPeriods)

  selectPeriod: (courseId) ->
    if courseId is @props.courseId
      @onSelect(@state.active)

  onSelect: (key) ->
    {courseId, handleSelect, handleKeyUpdate} = @props
    {sortedPeriods} = @state

    period = sortedPeriods?[key]
    unless period?
      throw new Error("BUG: #{key} period does not exist for course #{courseId}. There are only #{periods.length}.")
      return

    @setState(active: key)
    handleSelect?(period)
    handleKeyUpdate?(key)

  renderPeriod: (period, key) ->
    className = classnames({'is-trouble': period.is_trouble})
    tooltip =
      <BS.Tooltip id="course-periods-nav-tab-#{key}">
        {period.name}
      </BS.Tooltip>
    <BS.NavItem
      className={className}
      eventKey={key}
      key="period-nav-#{period.id}">
        <BS.OverlayTrigger
        placement='top'
        delayShow={1000}
        delayHide={0}
        overlay={tooltip}>
          <span className='tab-item-period-name'>{period.name}</span>
        </BS.OverlayTrigger>
    </BS.NavItem>


  render: ->
    {active, sortedPeriods} = @state
    {afterTabsItem} = @props
    periodsItems = _.map(sortedPeriods, @renderPeriod)

    <BS.Nav bsStyle='tabs' activeKey={active} onSelect={@onSelect}>
      {periodsItems}
      {afterTabsItem?()}
    </BS.Nav>


CoursePeriodsNavShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string

  getCourseId: ->
    {courseId} = @props
    {courseId} = @context.router.getCurrentParams() unless courseId?

    courseId

  renderCoursePeriodNav: ->
    courseId = @getCourseId()
    periods = CourseStore.getPeriods(courseId)

    <CoursePeriodsNav {...@props} courseId={courseId} periods={periods}/>

  render: ->
    courseId = @getCourseId()

    <LoadableItem
      id={courseId}
      store={CourseStore}
      actions={CourseActions}
      renderItem={@renderCoursePeriodNav}
    />

module.exports = {CoursePeriodsNav, CoursePeriodsNavShell}
