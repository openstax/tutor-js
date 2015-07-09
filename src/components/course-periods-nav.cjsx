React = require 'react'
BS = require 'react-bootstrap'
LoadableItem = require './loadable-item'
_ = require 'underscore'
camelCase = require 'camelcase'

{CourseActions, CourseStore} = require '../flux/course'

CoursePeriodsNav = React.createClass
  displayName: 'CoursePeriodsNav'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    handleSelect: React.PropTypes.func
    handleKeyUpdate: React.PropTypes.func
    initialActive: React.PropTypes.number.isRequired

  getDefaultProps: ->
    initialActive: 0

  getInitialState: ->
    active: @props.initialActive

  componentWillMount: ->
    CourseStore.on('course.loaded', @selectPeriod)

  componentWillUnmount: ->
    CourseStore.off('course.loaded', @selectPeriod)

  selectPeriod: (courseId) ->
    if courseId is @props.courseId
      @onSelect(@state.active)

  onSelect: (key) ->
    {courseId, periods, handleSelect, handleKeyUpdate} = @props

    period = periods?[key]
    unless period?
      throw new Error("BUG: #{key} period does not exist for course #{courseId}. There are only #{periods.length}.")
      return

    handleSelect?(period)
    handleKeyUpdate?(key)
    @setState(active: key)

  renderPeriod: (period, key) ->
    <BS.NavItem eventKey={key} key="period-nav-#{period.id}">{period.name}</BS.NavItem>

  render: ->
    {periods} = @props
    {active} = @state
    periods = _.sortBy(periods, 'name')
    periodsItems = _.map(periods, @renderPeriod)

    <BS.Nav bsStyle='tabs' activeKey={active} onSelect={@onSelect}>
      {periodsItems}
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
