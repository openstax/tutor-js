React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
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
    initialActive: React.PropTypes.number.isRequired
    periods: React.PropTypes.array.isRequired
    afterTabsItem: React.PropTypes.element

  contextTypes:
    router: React.PropTypes.func

  getDefaultProps: ->
    initialActive: 0
    sortedPeriods: []

  getInitialState: ->
    {tab} = @context.router.getCurrentQuery()
    active: if _.isUndefined(tab) then @props.initialActive else parseInt(tab, 10)

  componentWillMount: ->
    @setSortedPeriods(@props.periods)
    CourseStore.on('course.loaded', @selectPeriod)

  componentWillUnmount: ->
    CourseStore.off('course.loaded', @selectPeriod)

  componentWillReceiveProps: (nextProps) ->
    {tab} = @context.router.getCurrentQuery()
    unless _.isUndefined(tab)
      tab = parseInt(tab, 10)
      @updateTabSelectionState(tab)
    @setSortedPeriods(nextProps.periods)

  setSortedPeriods: (periods) ->
    # make sure that periods are sorted by name
    sortedPeriods = PeriodHelper.sort(periods)
    @setState(sortedPeriods: sortedPeriods)

  selectPeriod: (courseId) ->
    if courseId is @props.courseId
      @onTabSelection(@state.active)

  onTabSelection: (key) ->
    {sortedPeriods} = @state
    @context.router.transitionTo(@context.router.getCurrentPathname(), {}, {tab: key})
    @updateTabSelectionState(key)

  updateTabSelectionState: (active) ->
    return if @state.active is active

    {courseId, handleSelect, handleKeyUpdate} = @props

    period = @state.sortedPeriods[active]
    unless period?
      throw new Error("BUG: #{key} period does not exist for course #{courseId}. There are only #{periods.length}.")
      return

    @setState({active})
    handleSelect?(period)

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

    <BS.Nav bsStyle='tabs' activeKey={active} onSelect={@onTabSelection}>
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
