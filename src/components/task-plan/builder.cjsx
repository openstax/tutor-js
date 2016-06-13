React = require 'react'
Router = require 'react-router'
_ = require 'underscore'
moment = require 'moment-timezone'
BS = require 'react-bootstrap'

CourseGroupingLabel = require '../course-grouping-label'
PlanMixin = require './plan-mixin'
BindStoreMixin = require '../bind-store-mixin'

{TimeStore} = require '../../flux/time'
TutorDateFormat = TimeStore.getFormat()
TimeHelper = require '../../helpers/time'
{PeriodActions, PeriodStore} = require '../../flux/period'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TutorInput, TutorDateInput, TutorTimeInput, TutorDateFormat, TutorTextArea} = require '../tutor-input'
{CourseStore, CourseActions}   = require '../../flux/course'
{UnsavedStateMixin} = require '../unsaved-state'
{AsyncButton} = require 'openstax-react-components'

ISO_DATE_FORMAT = 'YYYY-MM-DD'


TaskingDateTime = React.createClass
  getInitialState: ->
    @getStateFromProps()

  getStateFromProps: (props) ->
    props ?= @props
    {value, defaultValue, isSetting} = props

    date = moment(value).format(ISO_DATE_FORMAT) if value?

    date: date
    time: defaultValue
    isSetting: isSetting()

  onTimeChange: (time) ->
    @setState({time})

  onDateChange: (date) ->
    date = date.format(ISO_DATE_FORMAT) if moment.isMoment(date)
    @setState({date})

  componentWillReceiveProps: (nextProps) ->
    nextState = @getStateFromProps(nextProps)
    @setState(nextState)

  componentDidUpdate: (prevProps, prevState) ->
    {date, time} = @state

    if @hasValidInputs() and not _.isEqual(prevState, @state)
      dateTime = "#{date} #{time}"
      @props.onChange(dateTime)

  hasValidInputs: ->
    _.isEmpty(@refs.date?.state?.errors) and _.isEmpty(@refs.time?.refs.timeInput?.state?.errors)

  canSetAsDefaultTime: ->
    _.isEmpty @refs.time?.refs.timeInput?.state?.errors

  setDefaultTime: ->
    {timeLabel, setDefaultTime} = @props
    {time} = @state

    timeChange = {}
    timeChange[timeLabel] = time

    setDefaultTime(timeChange)

  render: ->
    {isTimeDefault, label, taskingIdentifier} = @props
    {isSetting} = @state

    type = label.toLowerCase()

    timeProps = _.omit(@props, 'value', 'onChange', 'label')
    dateProps = _.omit(@props, 'defaultValue', 'onChange', 'label')

    timeProps.label = "#{label} Time"
    dateProps.label = "#{label} Date"

    if not isTimeDefault and @canSetAsDefaultTime()
      setAsDefaultExplanation = <BS.Popover id="tasking-datetime-default-tip-#{label}-#{taskingIdentifier}">
        {label} times for assignments created from now on will have this time set as the default.
      </BS.Popover>

      setAsDefault = <AsyncButton
        className='tasking-time-default'
        bsStyle='link'
        waitingText='Saving…'
        isWaiting={isSetting}
        onClick=@setDefaultTime>
        Set as default
        <BS.OverlayTrigger placement='top' overlay={setAsDefaultExplanation}>
          <i className="fa fa-info-circle"></i>
        </BS.OverlayTrigger>
      </AsyncButton>

    <BS.Col xs=12 md=6>
      <BS.Row>
        <BS.Col xs=8 md=7 className="tasking-date -assignment-#{type}-date">
          <TutorDateInput {...dateProps} onChange={@onDateChange} ref='date'/>
        </BS.Col>
        <BS.Col xs=4 md=5 className="tasking-time -assignment-#{type}-time">
          <TutorTimeInput {...timeProps} onChange={@onTimeChange} ref='time'/>
          {setAsDefault}
        </BS.Col>
      </BS.Row>
    </BS.Col>

TaskingDateTimes = React.createClass
  isTimeDefault: (time, defaultTime) ->
    return true if _.isUndefined(time)
    TimeHelper.makeMoment(time, 'HH:mm').isSame(TimeHelper.makeMoment(defaultTime, 'HH:mm'), 'minute')

  setDefaultTime: (timeChange) ->
    {courseId, period} = @props

    if period?
      PeriodActions.save(courseId, period.id, timeChange)
    else
      CourseActions.save(courseId, timeChange)

  isSetting: ->
    {courseId, period} = @props

    if period?
      PeriodStore.isSaving(courseId)
    else
      CourseStore.isSaving(courseId)

  render: ->
    {
      isVisibleToStudents,
      isEditable,
      period,
      id,
      taskingOpensAt,
      taskingDueAt,
      setDueAt,
      setOpensAt,
      dueTime,
      openTime,
      defaultDueTime,
      defaultOpenTime
    } = @props

    commonDateTimesProps = _.pick @props, 'required', 'currentLocale', 'taskingIdentifier'

    isDueTimeDefault = @isTimeDefault dueTime, defaultDueTime
    isOpenTimeDefault = @isTimeDefault openTime, defaultOpenTime

    maxOpensAt = TaskPlanStore.getMaxDueAt(id, period?.id)
    minDueAt = TaskPlanStore.getMinDueAt(id, period?.id)

    <BS.Col sm=8 md=9>
      <TaskingDateTime
        {...commonDateTimesProps}
        disabled={isVisibleToStudents or not isEditable}
        label="Open"
        ref="open"
        min={TimeStore.getNow()}
        max={maxOpensAt}
        onChange={_.partial(setOpensAt, _, period)}
        value={ taskingOpensAt }
        defaultValue={openTime or defaultOpenTime}
        setDefaultTime={@setDefaultTime}
        timeLabel='default_open_time'
        isTimeDefault={isOpenTimeDefault}
        isSetting={@isSetting} />
      <TaskingDateTime
        {...commonDateTimesProps}
        disabled={not isEditable}
        label="Due"
        ref="due"
        min={minDueAt}
        onChange={_.partial(setDueAt, _, period)}
        value={taskingDueAt}
        defaultValue={dueTime or defaultDueTime}
        setDefaultTime={@setDefaultTime}
        timeLabel='default_due_time'
        isTimeDefault={isDueTimeDefault}
        isSetting={@isSetting} />
    </BS.Col>


Tasking = React.createClass
  render: ->
    {
      isVisibleToStudents,
      isEnabled,
      period,
      togglePeriodEnabled,
      isEditable,
    } = @props

    taskingIdentifier = period?.id or 'common'

    if isEnabled
      if period?
        <BS.Row key="tasking-enabled-#{taskingIdentifier}" className="tasking-plan tutor-date-input">
          <BS.Col sm=4 md=3>
            <input
              id={"period-toggle-#{period.id}"}
              disabled={isVisibleToStudents}
              type='checkbox'
              onChange={_.partial(togglePeriodEnabled, period)}
              checked={true}/>
            <label className="period" htmlFor={"period-toggle-#{period.id}"}>{period.name}</label>
          </BS.Col>
          <TaskingDateTimes {...@props} taskingIdentifier={taskingIdentifier}/>
        </BS.Row>
      else
        <TaskingDateTimes {...@props} taskingIdentifier={taskingIdentifier}/>
    else
      if period?
        <BS.Row key="tasking-disabled-#{period.id}" className="tasking-plan disabled">
          <BS.Col sm=12>
            <input
              id={"period-toggle-#{period.id}"}
              type='checkbox'
              disabled={not isVisibleToStudents}
              onChange={_.partial(togglePeriodEnabled, period)}
              checked={false}/>
            <label className="period" htmlFor={"period-toggle-#{period.id}"}>{period.name}</label>
          </BS.Col>
        </BS.Row>
      else
        null


module.exports = React.createClass
  displayName: 'TaskPlanBuilder'
  mixins: [PlanMixin, BindStoreMixin, UnsavedStateMixin]
  bindStore: CourseStore
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    label: React.PropTypes.string

  getInitialState: ->
    isNewPlan = TaskPlanStore.isNew(@props.id)

    showingPeriods: not isNewPlan
    currentLocale: TimeHelper.getCurrentLocales()

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
    moment(TimeStore.getNow()).add(1, 'day').format(ISO_DATE_FORMAT)

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
      unless (dueAtMoment.isAfter(opensAt, 'day') and dueAtMoment.format(ISO_DATE_FORMAT) isnt opensAt)
        # make open date today if default due date is tomorrow
        opensAt = moment(TimeStore.getNow()).format(ISO_DATE_FORMAT)

    opensAt

  getQueriedDueAt: ->
    {due_at} = @context?.router?.getCurrentQuery() # attempt to read the due date from query params
    isNewPlan = TaskPlanStore.isNew(@props.id)
    dueAt = if due_at and isNewPlan then TimeHelper.getMomentPreserveDate(due_at).format(ISO_DATE_FORMAT)

  # Copies the available periods from the course store and sets
  # them to open at the default start date
  setPeriodDefaults: ->
    planId = @props.id
    isNewPlan = TaskPlanStore.isNew(@props.id)
    {courseId} = @props

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
    TaskPlanActions.setPeriods(planId, courseId, periods)

    unless isNewPlan
      @setState({showingPeriods: not (commonDates and hasAllTaskings)})

  getDefaultPlanDates: (periodId) ->
    taskingOpensAt = TaskPlanStore.getOpensAt(@props.id, periodId)
    taskingOpensAt ?= @getQueriedOpensAt()

    taskingDueAt = TaskPlanStore.getDueAt(@props.id, periodId)
    taskingDueAt ?= @getQueriedDueAt()

    {taskingOpensAt, taskingDueAt}

  # this will be called whenever the course store loads, but won't if
  # the store has already finished loading by the time the component mounts
  bindUpdate: ->
    @setPeriodDefaults()

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
    value = value.format(ISO_DATE_FORMAT) if moment.isMoment(value)
    TaskPlanActions.updateOpensAt(id, value, period?.id)

  setDueAt: (value, period) ->
    {id} = @props
    value = value.format(ISO_DATE_FORMAT) if moment.isMoment(value)
    TaskPlanActions.updateDueAt(id, value, period?.id)

  setAllPeriods: ->
    {courseId} = @props

    #save current taskings
    if @state.showingPeriods
      saveTaskings = TaskPlanStore.getEnabledTaskings(@props.id)
      @setState(showingPeriods: false, savedTaskings: saveTaskings)

    #get opens at and due at
    taskingOpensAt = TaskPlanStore.getOpensAt(@props.id) or TimeHelper.makeMoment(TimeStore.getNow()).format(ISO_DATE_FORMAT)
    @setOpensAt(taskingOpensAt)

    #enable all periods
    periods = _.map CourseStore.getPeriods(@props.courseId), (period) -> id: period.id
    TaskPlanActions.setPeriods(@props.id, courseId, periods, false)

    #set dates for all periods
    taskingDueAt = TaskPlanStore.getDueAt(@props.id) or @getQueriedDueAt()

    if taskingDueAt
      @setDueAt(taskingDueAt)
    else
      TaskPlanActions.clearDueAt(@props.id)


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
            Open time is 12:01am.
            Set date to today to open immediately.
            Due time is 7:00am.
            {cannotEditNote}
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
      disabled={@state.isVisibleToStudents}
      onChange={@setAllPeriods}
      checked={not @state.showingPeriods}/> if not @state.isVisibleToStudents

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
      disabled={@state.isVisibleToStudents}
      onChange={@setIndividualPeriods}
      checked={@state.showingPeriods}/> if not @state.isVisibleToStudents

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
    {isEditable, showingPeriods, currentLocale, isVisibleToStudents} = @state

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
