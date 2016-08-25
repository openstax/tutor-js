React = require 'react'
Router = require 'react-router'
_ = require 'underscore'
moment = require 'moment-timezone'
BS = require 'react-bootstrap'

{UnsavedStateMixin} = require '../../unsaved-state'
CourseGroupingLabel = require '../../course-grouping-label'
PlanMixin           = require '../plan-mixin'
BindStoresMixin     = require '../../bind-stores-mixin'
CourseGroupingLabel = require '../../course-grouping-label'
TimeZoneSettings    = require './time-zone-settings-link'

{TimeStore} = require '../../../flux/time'
TimeHelper = require '../../../helpers/time'
{PeriodActions, PeriodStore} = require '../../../flux/period'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{TaskingStore, TaskingActions} = require '../../../flux/tasking'
{TutorInput, TutorDateInput, TutorTimeInput, TutorTextArea} = require '../../tutor-input'
{CourseStore, CourseActions}   = require '../../../flux/course'
{AsyncButton} = require 'shared'

Tasking = require './tasking'

TaskPlanBuilder = React.createClass
  getBindEvents: ->
    {id} = @props

    taskingChanged:
      store: TaskingStore
      listenTo: "taskings.#{id}.*.changed"
      callback: @changeTaskPlan
    course:
      store: CourseStore
      callback: @updateForCourse

  mixins: [BindStoresMixin, UnsavedStateMixin]

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    label: React.PropTypes.string
    isVisibleToStudents: React.PropTypes.bool.isRequired
    isEditable: React.PropTypes.bool.isRequired
    isSwitchable: React.PropTypes.bool.isRequired

  getInitialState: ->
    {id} = @props

    showingPeriods: not TaskingStore.getTaskingsIsAll(id)
    currentLocale: TimeHelper.getCurrentLocales()

  getDefaultProps: ->
    label: 'Assignment'

  # Called by the UnsavedStateMixin to detect if anything needs to be persisted
  # This logic could be improved, all it checks is if a title is set on a new task plan
  hasUnsavedState: -> TaskPlanStore.hasChanged(@props.id)
  unsavedStateMessages: -> 'The assignment has unsaved changes'

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
    dueAt = if due_at then TimeHelper.getMomentPreserveDate(due_at).format(TimeHelper.ISO_DATE_FORMAT)

  # Copies the available periods from the course store and sets
  # them to open at the default start date
  setPeriodDefaults: ->
    {courseId, id} = @props
    {showingPeriods} = @state

    if TaskPlanStore.isNew(id)
      TaskingActions.create(id, {open_date: @getQueriedOpensAt(), due_date: @getQueriedDueAt()})
    else
      {tasking_plans} = TaskPlanStore.get(id)
      TaskingActions.loadTaskings(id, tasking_plans)

    nextState = {}
    nextState.showingPeriods = not TaskingStore.getTaskingsIsAll(id)

    @setState(nextState) unless _.isEmpty(nextState)

  loadCourseDefaults: ->
    {courseId} = @props
    courseDefaults = CourseStore.getTimeDefaults(courseId)

    return unless courseDefaults?

    periods = CourseStore.getPeriods(courseId)
    TaskingActions.loadDefaults(courseId, courseDefaults, periods)

  updateForCourse: ->
    @loadCourseDefaults()
    @forceUpdate()

  componentWillMount: ->
    {id, courseId} = @props
    courseTimezone = CourseStore.getTimezone(courseId)
    TimeHelper.syncCourseTimezone(courseTimezone)
    TaskingActions.loadTaskToCourse(id, courseId)

    @loadCourseDefaults()

    #set the periods defaults only after the timezone has been synced
    @setPeriodDefaults()

  componentWillUnmount: ->
    {id, courseId} = @props

    TimeHelper.unsyncCourseTimezone()

  changeTaskPlan: ->
    {id} = @props

    taskings = TaskingStore.getChanged(id)
    TaskPlanActions.replaceTaskings(id, taskings)

  setAllPeriods: ->
    {id} = @props
    TaskingActions.updateTaskingsIsAll(id, true)

    @setState(showingPeriods: false)

  setIndividualPeriods: ->
    {id} = @props
    TaskingActions.updateTaskingsIsAll(id, false)

    #clear saved taskings
    @setState(showingPeriods: true)

  setTitle: (title) ->
    {id} = @props
    TaskPlanActions.updateTitle(id, title)

  setDescription:(desc, descNode) ->
    {id} = @props
    TaskPlanActions.updateDescription(id, desc)

  render: ->
    plan = TaskPlanStore.get(@props.id)
    taskings = TaskingStore.get(@props.id)

    if (@state.showingPeriods and not taskings.length)
      invalidPeriodsAlert = <BS.Row>
        <BS.Col className="periods-invalid" sm=12>
          Please select at least
          one <CourseGroupingLabel lowercase courseId={@props.courseId} />
          <i className="fa fa-exclamation-circle"></i>
        </BS.Col>
      </BS.Row>

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
            disabled={not @props.isEditable}
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
            disabled={not @props.isEditable}
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
            <p>
              Set date and time to now to open
              immediately. Course time
              zone: <TimeZoneSettings courseId={@props.courseId} />
            </p>
            {<p>
              Open times cannot be edited after assignment is visible to students.
            </p> if @props.isVisibleToStudents}
          </div>
        </BS.Col>
      </BS.Row>

      {@renderCommonChoice() unless not @props.isSwitchable and @state.showingPeriods}
      {@renderPeriodsChoice() unless not @props.isSwitchable and not @state.showingPeriods}
      { invalidPeriodsAlert }
    </div>


  renderCommonChoice: ->
    radio = <input
      id='hide-periods-radio'
      name='toggle-periods-radio'
      ref='allPeriodsRadio'
      type='radio'
      disabled={not @props.isSwitchable}
      onChange={@setAllPeriods}
      checked={not @state.showingPeriods}/> if @props.isSwitchable

    <BS.Row className="common tutor-date-input">
      <BS.Col sm=4 md=3>
        {radio}
        <label className="period" htmlFor='hide-periods-radio'>
          All <CourseGroupingLabel courseId={@props.courseId} plural />
        </label>
      </BS.Col>
      {@renderTaskPlanRow()}
    </BS.Row>

  renderPeriodsChoice: ->
    radio = <input
      id='show-periods-radio'
      name='toggle-periods-radio'
      type='radio'
      disabled={not @props.isSwitchable}
      onChange={@setIndividualPeriods}
      checked={@state.showingPeriods}/> if @props.isSwitchable

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
    {id, courseId, isVisibleToStudents, isEditable, isSwitchable} = @props
    {showingPeriods, currentLocale} = @state

    taskingIdentifier = TaskingStore.getTaskingIndex(period)
    isEnabled = TaskingStore.isTaskingEnabled(id, period)
    isEnabled = false if showingPeriods and not period?

    <Tasking
      {...@props}
      isEnabled={isEnabled}
      ref={"tasking-#{taskingIdentifier}"}
      period={period}
      isVisibleToStudents={isVisibleToStudents}
      isEditable={isEditable}
      currentLocale={currentLocale} />

module.exports = TaskPlanBuilder
