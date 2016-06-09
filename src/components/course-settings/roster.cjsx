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

TabsWithChildren = require '../tabs-with-children'

CourseRoster = React.createClass

  mixins: [BindStoreMixin]
  bindStore: RosterStore
  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    tabIndex: 0
    activePeriod: _.first PH.activePeriods(CourseStore.get(@props.courseId))

  handleSelection: (ev, tabIndex) ->
    periods = PH.activePeriods(CourseStore.get(@props.courseId))
    activePeriod = periods[tabIndex] or _.first(periods)
    @setState({tabIndex})

  selectPreviousTab: ->
    if @state.tabIndex > 0
      previous = @state.tabIndex - 1
    else
      previous = 0
    @handleSelection({}, previous)

  renderActivePeriod: (periods) ->
    activePeriod = periods[@state.tabIndex]

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
          afterArchive={@selectPreviousTab}
        />

      </div>

      <PeriodRoster
        period={activePeriod}
        courseId={@props.courseId}
        activeTab={@state.tabIndex}
        isConceptCoach={CourseStore.isConceptCoach(@props.courseId)}
      />

      <DroppedRoster
        period={activePeriod}
        courseId={@props.courseId}
      />
    </div>

  renderEmpty: ->
    <NoPeriods />

  render: ->
    course  = CourseStore.get(@props.courseId)

    periods = PH.activePeriods(course)

    {tabIndex} = @state

    <div className="roster">
      <div className="settings-section periods">

        <TabsWithChildren
          tabs={_.pluck(periods, 'name')}
          onClick={@handleSelection}
        >
          <AddPeriodLink courseId={@props.courseId} periods={periods} />
          <ViewArchivedPeriods courseId={@props.courseId} />
        </TabsWithChildren>

      </div>

      {if periods[tabIndex] then @renderActivePeriod(periods) else @renderEmpty()}

    </div>

module.exports = CourseRoster
