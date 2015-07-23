React = require 'react'
Router = require 'react-router'
_ = require 'underscore'
moment = require 'moment'
BS = require 'react-bootstrap'

PlanMixin = require './plan-mixin'
BindStoreMixin = require '../bind-store-mixin'

{TimeStore} = require '../../flux/time'
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
    {showingPeriods: not isNewPlan}

  # Copies the available periods from the course store and sets
  # them to open at the default start date
  setPeriodDefaults: ->
    {date} = @getQuery() # attempt to read the start date from query params
    planId = @props.id
    isNewPlan = TaskPlanStore.isNew(@props.id)

    # check for common open/due dates, remember it now before we set defaults
    dueAt = TaskPlanStore.getDueAt(@props.id)
    opensAt = TaskPlanStore.getOpensAt(@props.id)
    commonDates = dueAt and opensAt

    #set default dates
    opensAt = if date and isNewPlan then moment(date).format(TutorDateFormat)
    if not opensAt
      opensAt = moment(TimeStore.getNow()).format(TutorDateFormat)

    #map tasking plans
    course = CourseStore.get(@props.courseId)
    periods = _.map course?.periods, (period) ->
      id: period.id, due_at: dueAt, opens_at: opensAt

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

    <div className="assignment">
      <BS.Row>
        <BS.Col sm=8 xs=12>
          <TutorInput
            label='Assignment Name'
            className='assignment-name'
            value={plan.title}
            id='reading-title'
            default={plan.title}
            required={true}
            onChange={@setTitle} />
        </BS.Col>
      </BS.Row><BS.Row>
        <BS.Col xs=12>
          <TutorTextArea
            label='Description'
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
            checked={not @state.showingPeriods}/>
          <label className="period" htmlFor='hide-periods-radio'>All Periods</label>
        </BS.Col>

        <BS.Col sm=4 md=3>
          <TutorDateInput
            id='reading-open-date'
            ref="openDate"
            readOnly={TaskPlanStore.isPublished(@props.id)}
            required={not @state.showingPeriods}
            label="Open Date"
            onChange={@setOpensAt}
            disabled={@state.showingPeriods}
            min={TimeStore.getNow()}
            max={TaskPlanStore.getDueAt(@props.id)}
            value={commonOpensAt}/>
        </BS.Col>

        <BS.Col sm=4 md=3>
          <TutorDateInput
            id='reading-due-date'
            ref="dueDate"
            readOnly={TaskPlanStore.isPublished(@props.id)}
            required={not @state.showingPeriods}
            label="Due Date"
            onChange={@setDueAt}
            disabled={@state.showingPeriods}
            min={TaskPlanStore.getOpensAt(@props.id)}
            value={commonDueAt}/>
        </BS.Col>
        <BS.Col sm=12 md=3>
          <div className="instructions">Feedback will be released after the due date.</div>
        </BS.Col>

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
          onChange={_.partial(@togglePeriodEnabled, plan)}
          checked={false}/>
        <label className="period" htmlFor={"period-toggle-#{plan.id}"}>{plan.name}</label>
      </BS.Col>
    </BS.Row>

  renderEnabledTasking: (plan) ->
    taskingOpensAt = TaskPlanStore.getOpensAt(@props.id, plan.id)
    if not taskingOpensAt or isNaN(taskingOpensAt.getTime())
      taskingOpensAt = TimeStore.getNow()
    <BS.Row key={plan.id} className="tasking-plan">
      <BS.Col sm=4 md=3>
        <input
          id={"period-toggle-#{plan.id}"}
          type='checkbox'
          onChange={_.partial(@togglePeriodEnabled, plan)}
          checked={true}/>
        <label className="period" htmlFor={"period-toggle-#{plan.id}"}>{plan.name}</label>
      </BS.Col><BS.Col sm=4 md=3>
        <TutorDateInput
          readOnly={TaskPlanStore.isPublished(@props.id)}
          label="Open Date"
          required={@state.showingPeriods}
          min={TimeStore.getNow()}
          max={TaskPlanStore.getDueAt(@props.id, plan.id)}
          onChange={_.partial(@setOpensAt, _, plan)}
          value={ taskingOpensAt }/>
      </BS.Col><BS.Col sm=4 md=3>
        <TutorDateInput
          readOnly={TaskPlanStore.isPublished(@props.id)}
          label="Due Date"
          required={@state.showingPeriods}
          min={taskingOpensAt}
          onChange={_.partial(@setDueAt, _, plan)}
          value={TaskPlanStore.getDueAt(@props.id, plan.id)}/>
        </BS.Col>
    </BS.Row>
