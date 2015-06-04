React = require 'react'
BS = require 'react-bootstrap'
LoadableItem = require './loadable-item'
_ = require 'underscore'
camelCase = require 'camelcase'

{CoursePeriodsActions, CoursePeriodsStore} = require '../flux/course-periods'

CoursePeriodsNavCore = React.createClass
  displayName: 'CoursePeriodsNavCore'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    handleSelect: React.PropTypes.func
    intialActive: React.PropTypes.number.isRequired

  getDefaultProps: ->
    intialActive: 0

  getInitialState: ->
    active: @props.intialActive

  onSelect: (key) ->
    {courseId, handleSelect} = @props
    periods = CoursePeriodsStore.get(courseId)

    period = periods[key]
    console.warn("#{key} period does not exist for course #{courseId}. There are only #{periods.length}.") unless period?

    handleSelect?(period)
    @setState(active: key)

  renderPeriod: (period, key) ->
    <BS.NavItem eventKey={key}>{period.name}</BS.NavItem>

  render: ->
    {courseId} = @props
    {active} = @state

    periods = CoursePeriodsStore.get(courseId)
    periodsItems = _.map(periods, @renderPeriod)

    <BS.Nav bsStyle='tabs' activeKey={active} onSelect={@onSelect}>
      {periodsItems}
    </BS.Nav>


CoursePeriodsNavLoadable = React.createClass
  displayName: 'CoursePeriodsNav'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string

  getCourseId: ->
    {courseId} = @props
    {courseId} = @context.router.getCurrentParams() unless courseId?

    courseId

  render: ->
    courseId = @getCourseId()
    @props.courseId ?= courseId

    <LoadableItem
      id={courseId}
      store={CoursePeriodsStore}
      actions={CoursePeriodsActions}
      renderItem={=> <CoursePeriodsNavCore {...@props}/>}
    />

module.exports = CoursePeriodsNavLoadable
