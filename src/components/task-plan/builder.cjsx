React = require 'react'
Router = require 'react-router'
_ = require 'underscore'
moment = require 'moment'
BS = require 'react-bootstrap'

PlanMixin = require './plan-mixin'
BindStoreMixin = require '../bind-store-mixin'

{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TutorInput, TutorDateInput, TutorDateFormat, TutorTextArea} = require '../tutor-input'
{CourseStore}   = require '../../flux/course'

module.exports = React.createClass
  displayName: 'TaskPlanBuilder'
  mixins: [PlanMixin, BindStoreMixin, Router.State]
  bindStore: CourseStore
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    isNewPlan = TaskPlanStore.isNew(@props.id)

    showingPeriods: not isNewPlan
    currentLocale: TimeHelper.getCurrentLocales()

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
    {date} = @getQuery() # attempt to read the start date from query params
    isNewPlan = TaskPlanStore.isNew(@props.id)
    opensAt = if date and isNewPlan then moment(date).format(TutorDateFormat)
    if not opensAt
      opensAt = moment(TimeStore.getNow()).format(TutorDateFormat)

    opensAt

  # Copies the available periods from the course store and sets
  # them to open at the default start date
  setPeriodDefaults: ->
    planId = @props.id
    isNewPlan = TaskPlanStore.isNew(@props.id)

    # check for common open/due dates, remember it now before we set defaults
    dueAt = TaskPlanStore.getDueAt(@props.id)
    commonDates = dueAt and TaskPlanStore.getOpensAt(@props.id)

    #map tasking plans
    periods = @mapPeriods(@getOpensAtDefault(), dueAt)

    #check to see if all tasking plans are there
    hasAllTaskings = _.reduce(periods, (memo, period) ->
      memo and TaskPlanStore.hasTasking(planId, period.id)
    , true)

    # Inform the store of the available periods
    TaskPlanActions.setPeriods(planId, periods)

    if not isNewPlan
      @setState({showingPeriods: not (commonDates and hasAllTaskings)})
      TaskPlanActions.disableEmptyTaskings(planId)

  # this will be called whenever the course store loads, but won't if
  # the store has already finished loading by the time the component mounts
  bindUpdate: ->
    @setPeriodDefaults()

  componentWillMount: ->
    @setPeriodDefaults()

  setOpensAt: (value, period) ->
    {id} = @props
    TaskPlanActions.updateOpensAt(id, value, period?.id)

  setDueAt: (value, period) ->
    {id} = @props
    TaskPlanActions.updateDueAt(id, value, period?.id)

  togglePeriodsDisplay: (ev) ->
    @setState(showingPeriods: not @state.showingPeriods)

  togglePeriodEnabled: (period, ev) ->
    if ev.target.checked
      TaskPlanActions.enableTasking(@props.id, period.id,
        @refs.openDate.getValue(), @refs.dueDate.getValue()
      )
    else
      TaskPlanActions.disableTasking(@props.id, period.id)


  setDescription:(desc, descNode) ->
    {id} = @props
    TaskPlanActions.updateDescription(id, desc)


  renderFeedbackNote: ->
    <BS.Col sm=12 md=3>
      <div className="instructions">Feedback will be released after the due date.</div>
    </BS.Col>

  render: ->
    plan = TaskPlanStore.get(@props.id)
    if (not @state.showingPeriods)
      commonDueAt = TaskPlanStore.getDueAt(@props.id)
      commonOpensAt = TaskPlanStore.getOpensAt(@props.id) or TimeStore.getNow()

    if (@state.showingPeriods and not plan.tasking_plans.length)
      invalidPeriodsAlert = <BS.Row>
        <BS.Col className="periods-invalid" sm=12>
          Please select at least one period
          <i className="fa fa-exclamation-circle"></i>
        </BS.Col>
      </BS.Row>

    if plan.type is 'homework'
      feedbackNote = @renderFeedbackNote()

    <div className="assignment">
      <BS.Row>
        <BS.Col sm=8 xs=12>
          <TutorInput
            label='Assignment name (this is what students will see on their dashboard)'
            className='assignment-name'
            id='reading-title'
            default={plan.title}
            required={true}
            onChange={@setTitle} />
        </BS.Col>
      </BS.Row><BS.Row>
        <BS.Col xs=12>
          <TutorTextArea
            label='Description or special instructions (students will see this)'
            className='assignment-description'
            id='assignment-description'
            default={TaskPlanStore.getDescription(@props.id)}
            onChange={@setDescription} />
        </BS.Col>
      </BS.Row><BS.Row>
        <BS.Col sm=4 md=3>Assign to</BS.Col>
      </BS.Row><BS.Row>

        <BS.Col sm=4 md=3>
          <input
            id='hide-periods-radio'
            name='toggle-periods-radio'
            type='radio'
            onChange={@togglePeriodsDisplay}
            disabled={TaskPlanStore.isVisibleToStudents(@props.id)}
            checked={not @state.showingPeriods}/>
          <label className="period" htmlFor='hide-periods-radio'>All Periods</label>
        </BS.Col>

        <BS.Col sm=4 md=3>
          <TutorDateInput
            id='reading-open-date'
            ref="openDate"
            required={not @state.showingPeriods}
            label="Open Date"
            onChange={@setOpensAt}
            disabled={@state.showingPeriods or TaskPlanStore.isVisibleToStudents(@props.id)}
            min={TimeStore.getNow()}
            max={TaskPlanStore.getDueAt(@props.id)}
            value={commonOpensAt}
            currentLocale={@state.currentLocale} />
        </BS.Col>

        <BS.Col sm=4 md=3>
          <TutorDateInput
            id='reading-due-date'
            ref="dueDate"
            required={not @state.showingPeriods}
            label="Due Date"
            onChange={@setDueAt}
            disabled={@state.showingPeriods}
            min={TaskPlanStore.getMinDueAt(@props.id)}
            value={commonDueAt}
            currentLocale={@state.currentLocale} />
        </BS.Col>
        {feedbackNote}

      </BS.Row>
      <BS.Row>
        <BS.Col sm=4 md=3></BS.Col>
        <BS.Col sm=4 md=3>
          <div className="instructions">Open time is 12:01am.</div>
          <div className="instructions">Set date to today to open immediately.</div>
        </BS.Col>
        <BS.Col sm=4 md=3>
          <div className="instructions">Due time is 7:00am</div>
        </BS.Col>
      </BS.Row>
      <BS.Row>

        <BS.Col sm=4 md=3>
          <input
            id='show-periods-radio'
            name='toggle-periods-radio'
            type='radio'
            onChange={@togglePeriodsDisplay}
            disabled={TaskPlanStore.isVisibleToStudents(@props.id)}
            checked={@state.showingPeriods}/>
          <label className="period" htmlFor='show-periods-radio'>Individual Periods</label>
        </BS.Col>

      </BS.Row>

      { _.map(CourseStore.get(@props.courseId)?.periods, @renderTaskPlanRow) if @state.showingPeriods }
      { invalidPeriodsAlert }

    </div>

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
          disabled={TaskPlanStore.isVisibleToStudents(@props.id)}
          onChange={_.partial(@togglePeriodEnabled, plan)}
          checked={false}/>
        <label className="period" htmlFor={"period-toggle-#{plan.id}"}>{plan.name}</label>
      </BS.Col>
    </BS.Row>

  renderEnabledTasking: (plan) ->
    taskingOpensAt = TaskPlanStore.getOpensAt(@props.id, plan.id)
    if not taskingOpensAt or isNaN(taskingOpensAt.getTime())
      taskingOpensAt = TimeStore.getNow()
    taskingDueAt = TaskPlanStore.getDueAt(@props.id, plan.id)
    if not taskingDueAt or isNaN(taskingDueAt.getTime())
      taskingDueAt = moment(TimeStore.getNow()).startOf('day').add(1, 'day')

    <BS.Row key={plan.id} className="tasking-plan">
      <BS.Col sm=4 md=3>
        <input
          id={"period-toggle-#{plan.id}"}
          disabled={TaskPlanStore.isVisibleToStudents(@props.id)}
          type='checkbox'
          onChange={_.partial(@togglePeriodEnabled, plan)}
          checked={true}/>
        <label className="period" htmlFor={"period-toggle-#{plan.id}"}>{plan.name}</label>
      </BS.Col><BS.Col sm=4 md=3>
        <TutorDateInput
          disabled={TaskPlanStore.isVisibleToStudents(@props.id)}
          label="Open Date"
          required={@state.showingPeriods}
          min={TimeStore.getNow()}
          max={TaskPlanStore.getDueAt(@props.id, plan.id)}
          onChange={_.partial(@setOpensAt, _, plan)}
          value={ taskingOpensAt }
          currentLocale={@state.currentLocale} />
      </BS.Col><BS.Col sm=4 md=3>
        <TutorDateInput
          label="Due Date"
          required={@state.showingPeriods}
          min={TaskPlanStore.getMinDueAt(@props.id, plan.id)}
          onChange={_.partial(@setDueAt, _, plan)}
          value={taskingDueAt}
          currentLocale={@state.currentLocale} />
        </BS.Col>
    </BS.Row>
