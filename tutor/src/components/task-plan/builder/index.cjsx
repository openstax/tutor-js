React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

{UnsavedStateMixin} = require '../../unsaved-state'
CourseGroupingLabel = require '../../course-grouping-label'
PlanMixin           = require '../plan-mixin'
BindStoresMixin     = require '../../bind-stores-mixin'
CourseGroupingLabel = require '../../course-grouping-label'
TimeZoneSettings    = require './time-zone-settings-link'

taskPlanEditingInitialize = require '../initialize-editing'

{TimeStore} = require '../../../flux/time'
TimeHelper = require '../../../helpers/time'
CourseDataHelper = require '../../../helpers/course-data'
{PeriodActions, PeriodStore} = require '../../../flux/period'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{TaskingStore, TaskingActions} = require '../../../flux/tasking'
{TutorInput, TutorTextArea} = require '../../tutor-input'
{default: Courses} = require '../../../models/courses-map'
{AsyncButton} = require 'shared'

Tasking = require './tasking'

TaskPlanBuilder = React.createClass
  getBindEvents: ->
    {id} = @props

    taskingChanged:
      store: TaskingStore
      listenTo: "taskings.#{id}.*.changed"
      callback: @changeTaskPlan

  mixins: [BindStoresMixin, UnsavedStateMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    label: React.PropTypes.string
    isVisibleToStudents: React.PropTypes.bool.isRequired
    isEditable: React.PropTypes.bool.isRequired
    isSwitchable: React.PropTypes.bool.isRequired

  getInitialState: ->
    {id} = @props

    term: CourseDataHelper.getCourseBounds(@props.courseId)
    showingPeriods: not TaskingStore.getTaskingsIsAll(id)
    currentLocale: TimeHelper.getCurrentLocales()

  getDefaultProps: ->
    label: 'Assignment'

  # Called by the UnsavedStateMixin to detect if anything needs to be persisted
  # This logic could be improved, all it checks is if a title is set on a new task plan
  hasUnsavedState: -> TaskPlanStore.hasChanged(@props.id)
  unsavedStateMessages: -> 'The assignment has unsaved changes'

  componentWillMount: ->
    {id, courseId} = @props
    {term} = @state

    # better to have `syncCourseTimezone` out here to make the symmetry
    # of the unsync in the unmount obvious.
    courseTimezone = Courses.get(courseId).time_zone
    TimeHelper.syncCourseTimezone(courseTimezone)

    nextState = taskPlanEditingInitialize(id, courseId, term)
    @setState(nextState)

  componentWillUnmount: ->
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
        </BS.Col>
      </BS.Row>

    assignmentNameLabel = [
      <span key='assignment-label'>{"#{@props.label} name"}</span>
      <span
        key='assignment-label-instructions'
        className='instructions'> (Students will see this on their dashboard.)</span>
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

    periodsChoice = Courses.get(@props.courseId).periods.map(@renderTaskPlanRow) if @state.showingPeriods
    periodsChoice ?= []
    periodsChoice.unshift(choiceLabel)
    periodsChoice

  renderTaskPlanRow: (period) ->
    {id, courseId, isVisibleToStudents, isEditable, isSwitchable} = @props
    {showingPeriods, currentLocale, term} = @state

    taskingIdentifier = TaskingStore.getTaskingIndex(period)
    isEnabled = TaskingStore.isTaskingEnabled(id, period)
    isEnabled = false if showingPeriods and not period?

    <Tasking
      key={period?.id or 'all'}
      {...@props}
      termStart={term.start}
      termEnd={term.end}
      isEnabled={isEnabled}
      ref={"tasking-#{taskingIdentifier}"}
      period={period}
      isVisibleToStudents={isVisibleToStudents}
      isEditable={isEditable}
      currentLocale={currentLocale} />

module.exports = TaskPlanBuilder
