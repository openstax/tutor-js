React = require 'react'
Router = require 'react-router'
_ = require 'underscore'
moment = require 'moment'
BS = require 'react-bootstrap'

PlanMixin = require './plan-mixin'
BindStoreMixin = require '../bind-store-mixin'

{TimeStore} = require '../../flux/time'
TutorDateFormat = TimeStore.getFormat()
TimeHelper = require '../../helpers/time'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TutorInput, TutorDateInput, TutorDateFormat, TutorTextArea} = require '../tutor-input'
{CourseStore}   = require '../../flux/course'
{UnsavedStateMixin} = require '../unsaved-state'

module.exports = React.createClass
  displayName: 'TaskPlanBuilder'
  mixins: [PlanMixin, BindStoreMixin, UnsavedStateMixin]
  bindStore: CourseStore
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    isNewPlan = TaskPlanStore.isNew(@props.id)

    showingPeriods: not isNewPlan
    currentLocale: TimeHelper.getCurrentLocales()

  # Called by the UnsavedStateMixin to detect if anything needs to be persisted
  # This logic could be improved, all it checks is if a title is set on a new task plan
  hasUnsavedState: ->
    TaskPlanStore.isChanged(@props.id)

  unsavedStateMessages: -> 'The assignment has unsaved changes'

  mapPeriods: (opensAt, dueAt) ->
    planId = @props.id
    isNewPlan = TaskPlanStore.isNew(@props.id)
    course = CourseStore.get(@props.courseId)

    _.map course?.periods, (period) ->
      if not TaskPlanStore.hasTasking(planId, period.id) and not isNewPlan
        tasking = id: period.id
      else
        tasking = id: period.id, due_at: dueAt, opens_at: opensAt

      tasking

  getOpensAtDefault: ->
    moment(TimeStore.getNow()).add(1, 'day').toDate()

  getQueriedOpensAt: ->
    {opens_at} = @context?.router?.getCurrentQuery() # attempt to read the open date from query params
    isNewPlan = TaskPlanStore.isNew(@props.id)
    opensAt = if opens_at and isNewPlan then moment(opens_at).toDate()
    if not opensAt
      # default open date is tomorrow
      opensAt = @getOpensAtDefault()

    # if there is a queried due date, make sure it's not the same as the open date
    dueAt = @getQueriedDueAt()
    if dueAt? and moment(dueAt).isSame(opensAt, 'day')
      # make open date today if default due date is tomorrow
      opensAt = moment(TimeStore.getNow()).toDate()

    opensAt

  getQueriedDueAt: ->
    {due_at} = @context?.router?.getCurrentQuery() # attempt to read the due date from query params
    isNewPlan = TaskPlanStore.isNew(@props.id)
    dueAt = if due_at and isNewPlan then moment(due_at).toDate()

  # Copies the available periods from the course store and sets
  # them to open at the default start date
  setPeriodDefaults: ->
    planId = @props.id
    isNewPlan = TaskPlanStore.isNew(@props.id)

    # check for common open/due dates, remember it now before we set defaults
    dueAt = TaskPlanStore.getDueAt(@props.id)
    commonDates = dueAt and TaskPlanStore.getOpensAt(@props.id)

    #map tasking plans
    periods = @mapPeriods(@getQueriedOpensAt(), dueAt or @getQueriedDueAt())

    #check to see if all tasking plans are there
    hasAllTaskings = _.reduce(periods, (memo, period) ->
      memo and TaskPlanStore.hasTasking(planId, period.id)
    , true)

    # Inform the store of the available periods
    TaskPlanActions.setPeriods(planId, periods)

    if not isNewPlan
      @setState({showingPeriods: not (commonDates and hasAllTaskings)})

  getDefaultPlanDates: (periodId) ->
    taskingOpensAt = TaskPlanStore.getOpensAt(@props.id, periodId)
    if not taskingOpensAt or isNaN(taskingOpensAt.getTime())
      taskingOpensAt = @getQueriedOpensAt()

    taskingDueAt = TaskPlanStore.getDueAt(@props.id, periodId)
    if not taskingDueAt or isNaN(taskingDueAt.getTime())
      taskingDueAt = @getQueriedDueAt()

    {taskingOpensAt, taskingDueAt}

  # this will be called whenever the course store loads, but won't if
  # the store has already finished loading by the time the component mounts
  bindUpdate: ->
    @setPeriodDefaults()

  componentWillMount: ->
    TimeHelper.syncCourseTimezone()
    #set the periods defaults only after the timezone has been synced
    @setPeriodDefaults()

  componentWillUnmount: ->
    TimeHelper.unsyncCourseTimezone()

  setOpensAt: (value, period) ->
    {id} = @props
    if Object.prototype.toString.call(value) is '[object Date]'
      value = moment(value).format(TutorDateFormat)

    TaskPlanActions.updateOpensAt(id, value, period?.id)

  setDueAt: (value, period) ->
    {id} = @props
    if Object.prototype.toString.call(value) is '[object Date]'
      value = moment(value).format(TutorDateFormat)

    TaskPlanActions.updateDueAt(id, value, period?.id)

  setAllPeriods: ->
    #save current taskings
    if @state.showingPeriods
      saveTaskings = TaskPlanStore.getEnabledTaskings(@props.id)
      @setState(showingPeriods: false, savedTaskings: saveTaskings)

    #get opens at and due at
    taskingOpensAt = TaskPlanStore.getOpensAt(@props.id) or TimeStore.getNow()
    @setOpensAt(taskingOpensAt)

    #enable all periods
    course = CourseStore.get(@props.courseId)
    periods = _.map course?.periods, (period) -> id: period.id
    TaskPlanActions.setPeriods(@props.id, periods)

    #set dates for all periods
    taskingDueAt = TaskPlanStore.getDueAt(@props.id)
    @setDueAt(taskingDueAt) if taskingDueAt

  setIndividualPeriods: ->
    # if taskings exist in state, then load them
    if (@state.savedTaskings) then TaskPlanActions.replaceTaskings(@props.id, @state.savedTaskings)

    #clear saved taskings
    @setState(
      showingPeriods: true
      savedTaskings: null
    )

  getSavedTaskingFor: (periodId) ->
    _.findWhere(@state.savedTaskings, {id: periodId.toString()})

  togglePeriodsDisplay: (ev) ->
    if (@state.showingPeriods is not @refs.allPeriodsRadio.props.checked)
      return

    if (@state.showingPeriods)
      @setAllPeriods()
    else
      @setIndividualPeriods()


  togglePeriodEnabled: (period, ev) ->
    {id} = @props

    periodTasking = @getSavedTaskingFor(period.id)
    {taskingOpensAt, taskingDueAt} = @getDefaultPlanDates(period.id)

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

    feedbackNote = '  Feedback will be released after the due date.' if plan.type is 'homework'
    cannotEditNote = '  Open times cannot be edited after assignment is visible to students.' if @state.isVisibleToStudents


    assignmentNameLabel = [
      'Assignment name'
      <span className='instructions'> (students will see this on their dashboard)</span>
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
            onChange={@setTitle} />
        </BS.Col>
      </BS.Row><BS.Row>
        <BS.Col xs=12>
          <TutorTextArea
            label='Description or special instructions'
            className='assignment-description'
            id='assignment-description'
            default={TaskPlanStore.getDescription(@props.id)}
            onChange={@setDescription} />
        </BS.Col>
      </BS.Row><BS.Row>
        <BS.Col sm=12 className='assign-to-label'>
          Assign to
        </BS.Col>
      </BS.Row>

      <BS.Row>
        <BS.Col sm=12>
          <div className="instructions">
            Open time is 12:01am.
            Set date to today to open immediately.
            Due time is 7:00am.
            {cannotEditNote}
            {feedbackNote}
          </div>
        </BS.Col>
      </BS.Row>

      {@renderCommonChoice() unless @state.isVisibleToStudents and @state.showingPeriods}
      {@renderPeriodsChoice() unless @state.isVisibleToStudents and not @state.showingPeriods}
      { invalidPeriodsAlert }
    </div>


  renderCommonChoice: ->
    radio = <input
      id='hide-periods-radio'
      name='toggle-periods-radio'
      ref='allPeriodsRadio'
      type='radio'
      onChange={@setAllPeriods}
      disabled={@state.isVisibleToStudents}
      checked={not @state.showingPeriods}/> unless @state.isVisibleToStudents

    <BS.Row className="common tutor-date-input">
      <BS.Col sm=4 md=3>
        {radio}
        <label className="period" htmlFor='hide-periods-radio'>All Periods</label>
      </BS.Col>
      {@renderCommonDateInputs() unless @state.showingPeriods}
    </BS.Row>

  renderCommonDateInputs: ->
    {taskingOpensAt, taskingDueAt} = @getDefaultPlanDates()
    commonOpensAt = taskingOpensAt
    commonDueAt = taskingDueAt

    opensAt = <BS.Col sm=4 md=3>
      <TutorDateInput
        className='-assignment-open-date'
        ref="openDate"
        required={not @state.showingPeriods}
        label="Open Date"
        onChange={@setOpensAt}
        disabled={@state.showingPeriods or @state.isVisibleToStudents or not @state.isEditable}
        min={TimeStore.getNow()}
        max={TaskPlanStore.getDueAt(@props.id)}
        value={commonOpensAt}
        currentLocale={@state.currentLocale} />
    </BS.Col>

    dueAt = <BS.Col sm=4 md=3>
      <TutorDateInput
        className='-assignment-due-date'
        ref="dueDate"
        required={not @state.showingPeriods}
        label="Due Date"
        onChange={@setDueAt}
        disabled={@state.showingPeriods or not @state.isEditable}
        min={TaskPlanStore.getMinDueAt(@props.id)}
        value={commonDueAt}
        currentLocale={@state.currentLocale} />
    </BS.Col>

    [
      opensAt,
      dueAt
    ]

  renderPeriodsChoice: ->
    radio = <input
      id='show-periods-radio'
      name='toggle-periods-radio'
      type='radio'
      onChange={@setIndividualPeriods}
      disabled={@state.isVisibleToStudents}
      checked={@state.showingPeriods}/> unless @state.isVisibleToStudents

    choiceLabel = <BS.Row>
      <BS.Col md=12>
        {radio}
        <label className="period" htmlFor='show-periods-radio'>Individual Periods</label>
      </BS.Col>
    </BS.Row>

    periodsChoice = _.map(CourseStore.get(@props.courseId)?.periods, @renderTaskPlanRow) if @state.showingPeriods
    periodsChoice ?= []
    periodsChoice.unshift(choiceLabel)
    periodsChoice


  renderTaskPlanRow: (plan) ->
    # newAndUnchanged = TaskPlanStore.isNew(@props.id) and not store.isChanged(@props.id)
    # if TaskPlanStore.hasTasking(@props.id, plan.id) or newAndUnchanged
    if TaskPlanStore.hasTasking(@props.id, plan.id)
      @renderEnabledTasking(plan)
    else
      @renderDisabledTasking(plan)

  renderDisabledTasking: (plan) ->
    <BS.Row key={plan.id} className="tasking-plan disabled">
      <BS.Col sm=12>
        <input
          id={"period-toggle-#{plan.id}"}
          type='checkbox'
          disabled={@state.isVisibleToStudents}
          onChange={_.partial(@togglePeriodEnabled, plan)}
          checked={false}/>
        <label className="period" htmlFor={"period-toggle-#{plan.id}"}>{plan.name}</label>
      </BS.Col>
    </BS.Row>

  renderEnabledTasking: (plan) ->
    {taskingOpensAt, taskingDueAt} = @getDefaultPlanDates(plan.id)

    <BS.Row key={plan.id} className="tasking-plan tutor-date-input">
      <BS.Col sm=4 md=3>
        <input
          id={"period-toggle-#{plan.id}"}
          disabled={@state.isVisibleToStudents}
          type='checkbox'
          onChange={_.partial(@togglePeriodEnabled, plan)}
          checked={true}/>
        <label className="period" htmlFor={"period-toggle-#{plan.id}"}>{plan.name}</label>
      </BS.Col><BS.Col sm=4 md=3>
        <TutorDateInput
          disabled={@state.isVisibleToStudents or not @state.isEditable}
          label="Open Date"
          required={@state.showingPeriods}
          min={TimeStore.getNow()}
          max={TaskPlanStore.getDueAt(@props.id, plan.id)}
          onChange={_.partial(@setOpensAt, _, plan)}
          value={ taskingOpensAt }
          currentLocale={@state.currentLocale} />
      </BS.Col><BS.Col sm=4 md=3>
        <TutorDateInput
          disabled={not @state.isEditable}
          label="Due Date"
          required={@state.showingPeriods}
          min={TaskPlanStore.getMinDueAt(@props.id, plan.id)}
          onChange={_.partial(@setDueAt, _, plan)}
          value={taskingDueAt}
          currentLocale={@state.currentLocale} />
        </BS.Col>
    </BS.Row>
