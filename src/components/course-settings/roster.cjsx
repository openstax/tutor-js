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

TabsWithChildren = require '../tabs-with-children'

module.exports = React.createClass
  displayName: 'PeriodRoster'
  mixins: [BindStoreMixin]
  bindStore: RosterStore
  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    tabIndex: 0
    activePeriod: _.first CourseStore.get(@props.courseId)?.periods

  handleSelection: (ev, tabIndex) ->
    periods = CourseStore.get(@props.courseId)?.periods or []
    activePeriod = periods[tabIndex] or _.first(periods)
    @setState({tabIndex, activePeriod})

  selectPreviousTab: ->
    if @state.tabIndex > 0
      previous = @state.tabIndex - 1
    else
      previous = 0
    @handleSelect({}, previous)


  render: ->
    course = CourseStore.get(@props.courseId)
    hasPeriods = not _.isEmpty course.periods
    {tabIndex, activePeriod} = @state

    tooltip =
      <BS.Tooltip id="roster-periods-nav-tab-#{tabIndex}">
        {activePeriod.name}
      </BS.Tooltip>
    name =
      <BS.OverlayTrigger
        placement='top'
        delayShow={1000}
        delayHide={0}
        overlay={tooltip}
      >
        <span className='tab-item-period-name'>{activePeriod.name}</span>
      </BS.OverlayTrigger>

    <div className="roster">
      <div className="settings-section periods">

        <TabsWithChildren
          tabs={_.pluck(course.periods, 'name')}
          onClick={@handleSelection}
        >
          <AddPeriodLink courseId={@props.courseId} periods={course.periods} />
        </TabsWithChildren>

      </div>

      <div className='period-edit-controls'>
        <StudentEnrollment
          period={activePeriod}
          courseId={@props.courseId}
        />
        <span className="spacer" />

        <RenamePeriodLink
          courseId={@props.courseId}
          periods={course.periods}
          period={activePeriod}
        />
        <DeletePeriodLink
          courseId={@props.courseId}
          period={activePeriod}
          selectPreviousTab={@selectPreviousTab}
        />
      </div>

      <PeriodRoster
        period={activePeriod}
        courseId={@props.courseId}
        activeTab={tabIndex}
        isConceptCoach={CourseStore.isConceptCoach(@props.courseId)}
      />

      <DroppedRoster
        period={activePeriod}
        courseId={@props.courseId}
        activeTab={tabIndex} />

    </div>


  # renderPeriod: (period, index) ->

  #   className = classnames({'is-trouble': period.is_trouble})
  #   tooltip =
  #     <BS.Tooltip id="roster-periods-nav-tab-#{index}">
  #       {period.name}
  #     </BS.Tooltip>
  #   name =
  #     <BS.OverlayTrigger
  #       placement='top'
  #       delayShow={1000}
  #       delayHide={0}
  #       overlay={tooltip}
  #     >
  #       <span className='tab-item-period-name'>{period.name}</span>
  #     </BS.OverlayTrigger>

  #   <BS.Tab tabIndex={period.id} eventTabIndex={index} title={name} tabClassName={className}>

  #     <PeriodRoster
  #       period={period}
  #       courseId={@props.courseId}
  #       activeTab={@state.activePeriod}
  #       isConceptCoach={CourseStore.isConceptCoach(@props.courseId)}
  #     />

  #     <DroppedRoster
  #       period={period}
  #       courseId={@props.courseId}
  #       activeTab={@state.activePeriod} />

  #   </BS.Tab>
        #       <BS.Tabs activeTabIndex={@state.tabIndex} onSelect={@handleSelect} animation={false}>
        #   <div><span className='course-settings-subtitle tabbed'>Roster</span></div>
        #   {<NoPeriods noPanel={true} /> unless hasPeriods}
        #   {_.map course.periods, @renderPeriod}
        # </BS.Tabs>

      #  if hasPeriods and CourseStore.isConceptCoach(@props.courseId)
