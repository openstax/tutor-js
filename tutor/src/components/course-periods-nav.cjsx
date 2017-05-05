React = require 'react'
BS = require 'react-bootstrap'
Router = require '../helpers/router'
LoadableItem = require './loadable-item'
_ = require 'underscore'
classnames = require 'classnames'

{CourseActions, CourseStore} = require '../flux/course'
{default: PeriodHelper} = require '../helpers/period'
Tabs = require './tabs'

CoursePeriodsNav = React.createClass
  displayName: 'CoursePeriodsNav'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    handleSelect: React.PropTypes.func
    initialActive: React.PropTypes.number.isRequired
    periods: React.PropTypes.array.isRequired
    afterTabsItem: React.PropTypes.element

  getDefaultProps: ->
    initialActive: 0
    sortedPeriods: []

  getInitialState: ->
    tabIndex: 0

  componentWillMount: ->
    @setSortedPeriods(@props.periods)
    CourseStore.on('course.loaded', @update)

  componentWillUnmount: ->
    CourseStore.off('course.loaded', @update)

  update: -> @forceUpdate()

  componentWillReceiveProps: (nextProps) ->
    @setSortedPeriods(nextProps.periods)

  setSortedPeriods: (periods) ->
    # make sure that periods are sorted by name
    sortedPeriods = PeriodHelper.sort(periods)
    @setState(sortedPeriods: sortedPeriods)


  onTabSelection: (tabIndex, ev) ->
    return if @state.tabIndex is tabIndex

    {courseId, handleSelect} = @props
    period = @state.sortedPeriods[tabIndex]
    if period?
      @setState({tabIndex})
      handleSelect?(period, tabIndex)
    else
      ev.preventDefault()


  renderPeriod: (period, key) ->
    className = classnames({'is-trouble': period.is_trouble})
    tooltip =
      <BS.Tooltip id="course-periods-nav-tab-#{key}">
        {period.name}
      </BS.Tooltip>

    <div className={className}>
        <BS.OverlayTrigger
        placement='top'
        delayShow={1000}
        delayHide={0}
        overlay={tooltip}>
          <span className='tab-item-period-name'>{period.name}</span>
        </BS.OverlayTrigger>
    </div>


  render: ->
    <Tabs
      ref="tabs"
      tabs={_.map @state.sortedPeriods, @renderPeriod}
      onSelect={@onTabSelection}
    >
      {@props.afterTabsItem}
    </Tabs>


CoursePeriodsNavShell = React.createClass

  propTypes:
    courseId: React.PropTypes.string

  getCourseId: ->
    {courseId} = @props
    {courseId} = Router.currentParams() unless courseId?

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
