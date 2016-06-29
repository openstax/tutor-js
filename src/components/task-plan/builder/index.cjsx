React = require 'react'
Router = require 'react-router'
_ = require 'underscore'
moment = require 'moment-timezone'
BS = require 'react-bootstrap'

{UnsavedStateMixin} = require '../../unsaved-state'
CourseGroupingLabel = require '../../course-grouping-label'
PlanMixin           = require '../plan-mixin'
BindStoreMixin      = require '../../bind-store-mixin'

{TimeStore} = require '../../../flux/time'
TutorDateFormat = TimeStore.getFormat()
TimeHelper = require '../../../helpers/time'
{PeriodActions, PeriodStore} = require '../../../flux/period'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{TutorInput, TutorDateInput, TutorTimeInput, TutorDateFormat, TutorTextArea} = require '../../tutor-input'
{CourseStore, CourseActions}   = require '../../../flux/course'
{AsyncButton} = require 'openstax-react-components'

Tasking = require './tasking'

TaskPlanBuilder = React.createClass

  mixins: [PlanMixin, BindStoreMixin, UnsavedStateMixin]
  bindStore: CourseStore
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    label: React.PropTypes.string

  getInitialState: ->
    {courseId, id} = @props

    isNewPlan = TaskPlanStore.isNew(id)

    showingPeriods: not isNewPlan or (isNewPlan and not TaskPlanStore.areDefaultsCommon(courseId))
    currentLocale: TimeHelper.getCurrentLocales()
    isInitialized: false
    savedIndividualTaskings: null
    savedAllTaskings: null

  getDefaultProps: ->
    label: 'Assignment'

  # Called by the UnsavedStateMixin to detect if anything needs to be persisted
  # This logic could be improved, all it checks is if a title is set on a new task plan
  hasUnsavedState: -> TaskPlanStore.hasChanged(@props.id)
  unsavedStateMessages: -> 'The assignment has unsaved changes'

  mapPeriods: (opensAt, dueAt) ->
    planId = @props.id
    isNewPlan = TaskPlanStore.isNew(@props.id)
    course = CourseStore.get(@props.courseId)
    _.map CourseStore.getPeriods(@props.courseId), (period) ->
      if not TaskPlanStore.hasTasking(planId, period.id) and not isNewPlan
        tasking = id: period.id
      else
        tasking = id: period.id, due_at: dueAt, opens_at: opensAt

      tasking

  getOpensAtDefault: ->
    moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)

  getQueriedOpensAt: ->
    {opens_at} = @context?.router?.getCurrentQuery() # attempt to read the open date from query params
    isNewPlan = TaskPlanStore.isNew(@props.id)
    opensAt = if opens_at and isNewPlan then TimeHelper.getMomentPreserveDate(opens_at)
    if not opensAt
      # default open date is tomorrow
      opensAt = @getOpensAtDefault()

    # if there is a queried due date, make sure it's not the same as the open date
    dueAt = @getQueriedDueAt()

    if dueAt?
      dueAtMoment = TimeHelper.getMomentPreserveDate(dueAt)
      # there's a corner case is certain timezones where isAfter doesn't quite cut it
      # and we need to check that the ISO strings don't match
      unless (dueAtMoment.isAfter(opensAt, 'day') and dueAtMoment.format(TimeHelper.ISO_DATE_FORMAT) isnt opensAt)
        # make open date today if default due date is tomorrow
        opensAt = moment(TimeStore.getNow()).format(TimeHelper.ISO_DATE_FORMAT)

    opensAt

  getQueriedDueAt: ->
    {due_at} = @context?.router?.getCurrentQuery() # attempt to read the due date from query params
    isNewPlan = TaskPlanStore.isNew(@props.id)
    dueAt = if due_at and isNewPlan then TimeHelper.getMomentPreserveDate(due_at).format(TimeHelper.ISO_DATE_FORMAT)

  # Copies the available periods from the course store and sets
  # them to open at the default start date
  setPeriodDefaults: ->
    {courseId, id} = @props
    {showingPeriods, isInitialized} = @state

    isNewPlan = TaskPlanStore.isNew(id)

    # check for common open/due dates, remember it now before we set defaults
    dueAt = TaskPlanStore.getDueAt(id)
    commonDates = dueAt and TaskPlanStore.getOpensAt(id)

    #map tasking plans
    periods = @mapPeriods(@getQueriedOpensAt(), dueAt or @getQueriedDueAt())

    #check to see if all tasking plans are there
    hasAllTaskings = _.every periods, (period) ->
      TaskPlanStore.hasTasking(id, period.id)

    nextState = {}
    nextState.isInitialized = true unless isInitialized
    nextState.showingPeriods = not (commonDates and hasAllTaskings) unless isNewPlan

    # Inform the store of the available periods
    TaskPlanActions.setPeriods(id, courseId, periods,
      not isInitialized, not (nextState.showingPeriods or showingPeriods))

    @setState(nextState) unless _.isEmpty(nextState)

  getDefaultPlanDates: (periodId) ->
    taskingOpensAt = TaskPlanStore.getOpensAt(@props.id, periodId)
    taskingOpensAt ?= @getQueriedOpensAt()

    taskingDueAt = TaskPlanStore.getDueAt(@props.id, periodId)
    taskingDueAt ?= @getQueriedDueAt()

    {taskingOpensAt, taskingDueAt}

  componentWillMount: ->
    {courseId} = @props
    TimeHelper.syncCourseTimezone(courseId)
    #set the periods defaults only after the timezone has been synced
    @setPeriodDefaults()

  componentWillUnmount: ->
    {courseId} = @props
    TimeHelper.unsyncCourseTimezone(courseId)

  setOpensAt: (value, period) ->
    {id} = @props
    value = value.format(TimeHelper.ISO_DATE_FORMAT) if moment.isMoment(value)
    TaskPlanActions.updateOpensAt(id, value, period?.id)

  setDueAt: (value, period) ->
    {id} = @props
    value = value.format(TimeHelper.ISO_DATE_FORMAT) if moment.isMoment(value)
    TaskPlanActions.updateDueAt(id, value, period?.id)

  setTaskingsToDefaults: ->
    dueAt = TaskPlanStore.getDueAt(@props.id)
    opensAt = TaskPlanStore.getOpensAt(@props.id)
    periods = @mapPeriods(opensAt or @getQueriedOpensAt(), dueAt or @getQueriedDueAt())
    TaskPlanActions.setDefaultTimesForPeriods(@props.id, @props.courseId, periods)

  setAllPeriods: ->
    {courseId} = @props
    {showingPeriods, savedAllTaskings} = @state

    #save current taskings
    saveTaskings = TaskPlanStore.getEnabledTaskings(@props.id)

    if savedAllTaskings
      TaskPlanActions.replaceTaskings(@props.id, savedAllTaskings)
    else
      @setTaskingsToDefaults()

    @setState(
      showingPeriods: false
      savedIndividualTaskings: saveTaskings
      savedAllTaskings: null
    )

  setIndividualPeriods: ->
    savedAllTaskings = TaskPlanStore.getEnabledTaskings(@props.id)

    # if taskings exist in state, then load them
    if (@state.savedIndividualTaskings)
      TaskPlanActions.replaceTaskings(@props.id, @state.savedIndividualTaskings)
    else
      @setTaskingsToDefaults()

    #clear saved taskings
    @setState(
      showingPeriods: true
      savedIndividualTaskings: null
      savedAllTaskings: savedAllTaskings
    )

  getSavedTaskingFor: (periodId) ->
    _.findWhere(@state.savedIndividualTaskings, {id: periodId.toString()})

  togglePeriodEnabled: (period, ev) ->
    {id} = @props

    periodTasking = @getSavedTaskingFor(period.id)

    if ev.target.checked
      if periodTasking?
        TaskPlanActions.enableTasking(@props.id, period.id,
          periodTasking.opens_at, periodTasking.due_at
        )
      else
        {taskingOpensAt, taskingDueAt} = @getDefaultPlanDates(period.id)
        TaskPlanActions.enableTasking(@props.id, period.id,
          taskingOpensAt, taskingDueAt
        )
    else
      TaskPlanActions.disableTasking(@props.id, period.id)


  setDescription:(desc, descNode) ->
    {id} = @props
    TaskPlanActions.updateDescription(id, desc)

  render: ->
    plan = TaskPlanStore.get(@props.id)

    if (@state.showingPeriods and not plan.tasking_plans.length)
      invalidPeriodsAlert = <BS.Row>
        <BS.Col className="periods-invalid" sm=12>
          Please select at least one period
          <i className="fa fa-exclamation-circle"></i>
        </BS.Col>
      </BS.Row>

    cannotEditNote = '  Open times cannot be edited after assignment is visible to students.' if @state.isVisibleToStudents

    assignmentNameLabel = [
      <span key='assignment-label'>{"#{@props.label} name"}</span>
      <span
        key='assignment-label-instructions'
        className='instructions'> (students will see this on their dashboard)</span>
    ]

    <div className="assignment">
      <BS.Row>
        <BS.Col xs=12>
          <TutorInput
            label={assignmentNameLabel}
            className='assignment-name'
            id='reading-title'
            default={plan.title}
            required={true}
            disabled={not @state.isEditable}
            onChange={@setTitle} />
        </BS.Col>
      </BS.Row>
      <BS.Row>
        <BS.Col xs=12>
          <TutorTextArea
            label='Description or special instructions'
            className='assignment-description'
            id='assignment-description'
            default={TaskPlanStore.getDescription(@props.id)}
            disabled={not @state.isEditable}
            onChange={@setDescription} />
        </BS.Col>
      </BS.Row>
      <BS.Row>
        <BS.Col sm=12 className='assign-to-label'>
          Assign to
        </BS.Col>
      </BS.Row>

      <BS.Row>
        <BS.Col sm=12>
          <div className="instructions">
            Set date and time to now to open immediately.
            {cannotEditNote}
          </div>
        </BS.Col>
      </BS.Row>

      {@renderCommonChoice() unless not @state.isSwitchable and @state.showingPeriods}
      {@renderPeriodsChoice() unless not @state.isSwitchable and not @state.showingPeriods}
      { invalidPeriodsAlert }
    </div>


  renderCommonChoice: ->
    radio = <input
      id='hide-periods-radio'
      name='toggle-periods-radio'
      ref='allPeriodsRadio'
      type='radio'
      disabled={not @state.isSwitchable}
      onChange={@setAllPeriods}
      checked={not @state.showingPeriods}/> if @state.isSwitchable

    <BS.Row className="common tutor-date-input">
      <BS.Col sm=4 md=3>
        {radio}
        <label className="period" htmlFor='hide-periods-radio'>All Periods</label>
      </BS.Col>
      {@renderTaskPlanRow()}
    </BS.Row>

  renderPeriodsChoice: ->
    radio = <input
      id='show-periods-radio'
      name='toggle-periods-radio'
      type='radio'
      disabled={not @state.isSwitchable}
      onChange={@setIndividualPeriods}
      checked={@state.showingPeriods}/> if @state.isSwitchable

    choiceLabel = <BS.Row key='tasking-individual-choice'>
      <BS.Col md=12>
        {radio}
        <label className="period" htmlFor='show-periods-radio'>
          Individual <CourseGroupingLabel courseId={@props.courseId} plural />
        </label>
      </BS.Col>
    </BS.Row>

    periodsChoice = _.map(CourseStore.getPeriods(@props.courseId), @renderTaskPlanRow) if @state.showingPeriods
    periodsChoice ?= []
    periodsChoice.unshift(choiceLabel)
    periodsChoice

  renderTaskPlanRow: (period) ->
    {id, courseId} = @props
    {taskingOpensAt, taskingDueAt} = @getDefaultPlanDates(period?.id)
    {isEditable, showingPeriods, currentLocale, isVisibleToStudents, isSwitchable} = @state

    openTime = TaskPlanStore.getOpensAtTime(id, period?.id)
    dueTime = TaskPlanStore.getDueAtTime(id, period?.id)
    {default_due_time, default_open_time} = CourseStore.getDefaultTimes(courseId, period?.id)

    isEnabled = if period?
      TaskPlanStore.hasTasking(id, period.id)
    else
      not showingPeriods

    <Tasking
      {...@props}
      period={period}
      setDueAt={@setDueAt}
      setOpensAt={@setOpensAt}
      togglePeriodEnabled={@togglePeriodEnabled}
      isVisibleToStudents={isVisibleToStudents}
      isEditable={isEditable}
      isEnabled={isEnabled}
      currentLocale={currentLocale}
      required={isEnabled}
      taskingOpensAt={taskingOpensAt}
      taskingDueAt={taskingDueAt}
      dueTime={dueTime}
      openTime={openTime}
      defaultDueTime={default_due_time}
      defaultOpenTime={default_open_time} />

module.exports = TaskPlanBuilder
