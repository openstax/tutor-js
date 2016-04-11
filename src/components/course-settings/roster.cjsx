React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
classnames = require 'classnames'

BindStoreMixin = require '../bind-store-mixin'
NoPeriods = require '../no-periods'

{CourseStore, CourseActions} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'

PeriodRoster = require './period-roster'
DroppedRoster = require './dropped-roster'

PeriodEnrollmentCode = require './period-enrollment-code'

AddPeriodLink = require './add-period'
RenamePeriodLink = require './rename-period'
DeletePeriodLink = require './delete-period'

module.exports = React.createClass
  displayName: 'PeriodRoster'
  mixins: [BindStoreMixin]
  bindStore: RosterStore
  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    key: 0

  handleSelect: (key) ->
    @setState({key})

  getActivePeriod: (active, periods) ->
    for period, i in periods
      if i is active
        name = period.name
        id = period.id
    {name, id}

  selectPreviousTab: ->
    if @state.key > 0
      previous = @state.key - 1
    else
      previous = 0
    @handleSelect(previous)

  render: ->
    course = CourseStore.get(@props.courseId)
    {is_concept_coach} = course
    periods = course.periods.length > 0
    tabs = _.map course.periods, (period, index) =>
      className = classnames({'is-trouble': period.is_trouble})
      tooltip =
        <BS.Tooltip id="roster-periods-nav-tab-#{index}">
          {period.name}
        </BS.Tooltip>
      name =
        <BS.OverlayTrigger
        placement='top'
        delayShow={1000}
        delayHide={0}
        overlay={tooltip}>
          <span className='tab-item-period-name'>{period.name}</span>
        </BS.OverlayTrigger>

      <BS.Tab key={period.id} eventKey={index} title={name} tabClassName={className}>

        <PeriodRoster
        period={period}
        courseId={@props.courseId}
        activeTab={@getActivePeriod(@state.key, course.periods)}
        isConceptCoach={is_concept_coach} />
        <div className="settings-section dropped-students">
          <div><span className='course-settings-subtitle tabbed'>Dropped Students</span></div>
          <DroppedRoster
          period={period}
          courseId={@props.courseId}
          activeTab={@getActivePeriod(@state.key, course.periods)} />
        </div>
      </BS.Tab>


    enrollmentButton =
      <PeriodEnrollmentCode
      activeTab={@getActivePeriod(@state.key, course.periods)}
      periods={course.periods}
      bookUrl={course.webview_url}
      bookName={course.salesforce_book_name} />
    renameButton =
      <RenamePeriodLink
      courseId={@props.courseId}
      periods={course.periods}
      activeTab={@getActivePeriod(@state.key, course.periods)} />
    deleteButton =
      <DeletePeriodLink
      courseId={@props.courseId}
      periods={course.periods}
      activeTab={@getActivePeriod(@state.key, course.periods)}
      selectPreviousTab={@selectPreviousTab} />
    noPeriodMessage =
      <NoPeriods noPanel={true} />

    <div>
      <div className="settings-section periods">
        <BS.Tabs activeKey={@state.key} onSelect={@handleSelect} animation={false}>
          <div className='period-edit-ui'>
            <AddPeriodLink courseId={@props.courseId} periods={course.periods} />
            {renameButton if periods}
            {deleteButton if periods}
          </div>
          {enrollmentButton if periods and is_concept_coach}
          <div><span className='course-settings-subtitle tabbed'>Roster</span></div>
          {noPeriodMessage unless periods}
          {tabs}
        </BS.Tabs>
      </div>

    </div>
