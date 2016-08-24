React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
classnames = require 'classnames'

BindStoreMixin = require '../bind-store-mixin'
NoPeriods = require '../no-periods'
PH = require '../../helpers/period'

{CourseStore, CourseActions} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'

PeriodRoster = require './period-roster'
DroppedRoster = require './dropped-roster'
ViewArchivedPeriods = require './view-archived-periods'
StudentEnrollment = require './student-enrollment'

AddPeriodLink = require './add-period'
RenamePeriodLink = require './rename-period'
ArchivePeriodLink = require './archive-period'

Tabs = require '../tabs'

CourseRoster = React.createClass

  mixins: [BindStoreMixin]
  bindStore: RosterStore
  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    periodIndex: 0

  onTabSelection: (periodIndex, ev) ->
    if PH.activePeriods(CourseStore.get(@props.courseId))[periodIndex]
      @setState({periodIndex})
    else
      ev.preventDefault()

  selectPreviousPeriod: ->
    if @state.periodIndex > 0
      periodIndex = @state.periodIndex - 1
    else
      periodIndex = 0
    @setState({periodIndex})
    @refs.tabs.selectTabIndex(periodIndex)

  renderActivePeriod: (periods) ->
    activePeriod = periods[@state.periodIndex]

    <div className="active-period">
      <div className='period-edit-controls'>
        <StudentEnrollment
          period={activePeriod}
          courseId={@props.courseId}
        />
        <span className="spacer" />

        <RenamePeriodLink
          courseId={@props.courseId}
          periods={periods}
          period={activePeriod}
        />

        <ArchivePeriodLink
          courseId={@props.courseId}
          period={activePeriod}
          periods={periods}
          afterArchive={@selectPreviousPeriod}
        />

      </div>

      <PeriodRoster
        period={activePeriod}
        courseId={@props.courseId}
        activeTab={@state.periodIndex}
        isConceptCoach={CourseStore.isConceptCoach(@props.courseId)}
      />

      <DroppedRoster
        period={activePeriod}
        courseId={@props.courseId}
      />
    </div>

  renderEmpty: ->
    <NoPeriods courseId={@props.courseId} link={false}/>

  render: ->
    course  = CourseStore.get(@props.courseId)

    periods = PH.activePeriods(course)

    {periodIndex} = @state

    <div className="roster">
      <div className="settings-section periods">

        <Tabs
          ref="tabs"
          tabs={_.pluck(periods, 'name')}
          onSelect={@onTabSelection}
        >
          <AddPeriodLink courseId={@props.courseId} periods={periods} />
          <ViewArchivedPeriods courseId={@props.courseId}
            afterRestore={@selectPreviousPeriod} />
        </Tabs>

      </div>

      {if periods[periodIndex] then @renderActivePeriod(periods) else @renderEmpty()}

    </div>

module.exports = CourseRoster
