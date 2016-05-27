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

StudentEnrollment = require './student-enrollment'

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
    activePeriod: _.first CourseStore.get(@props.courseId)?.periods

  handleSelect: (key) ->
    periods = CourseStore.get(@props.courseId)?.periods or []
    activePeriod = periods[key] or _.first(periods)
    @setState({key, activePeriod})

  selectPreviousTab: ->
    if @state.key > 0
      previous = @state.key - 1
    else
      previous = 0
    @handleSelect(previous)

  renderPeriod: (period, index) ->

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
        overlay={tooltip}
      >
        <span className='tab-item-period-name'>{period.name}</span>
      </BS.OverlayTrigger>

    <BS.Tab key={period.id} eventKey={index} title={name} tabClassName={className}>

      <PeriodRoster
        period={period}
        courseId={@props.courseId}
        activeTab={@state.activePeriod}
        isConceptCoach={CourseStore.isConceptCoach(@props.courseId)}
      />

      <DroppedRoster
        period={period}
        courseId={@props.courseId}
        activeTab={@state.activePeriod} />

    </BS.Tab>


  render: ->
    course = CourseStore.get(@props.courseId)
    hasPeriods = not _.isEmpty course.periods

    <div>
      <div className="settings-section periods">
        <BS.Tabs activeKey={@state.key} onSelect={@handleSelect} animation={false}>
          <div className='period-edit-ui'>
            <AddPeriodLink courseId={@props.courseId} periods={course.periods} />
            <RenamePeriodLink
              courseId={@props.courseId}
              period={@state.activePeriod}
            />
            <DeletePeriodLink
              courseId={@props.courseId}
              period={@state.activePeriod}
              selectPreviousTab={@selectPreviousTab}
            />
          </div>
          <StudentEnrollment
            period={@state.activePeriod}
            courseId={@props.courseId}
          />
          <div><span className='course-settings-subtitle tabbed'>Roster</span></div>
          {<NoPeriods noPanel={true} /> unless hasPeriods}
          {_.map course.periods, @renderPeriod}
        </BS.Tabs>
      </div>

    </div>

      #  if hasPeriods and CourseStore.isConceptCoach(@props.courseId)
