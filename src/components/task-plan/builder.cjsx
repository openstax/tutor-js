React = require 'react'
Router = require 'react-router'
_ = require 'underscore'
moment = require 'moment'
BS = require 'react-bootstrap'

PlanMixin = require './plan-mixin'
BindStoreMixin = require '../bind-store-mixin'

{TimeStore} = require '../../flux/time'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TutorInput, TutorDateInput, TutorTextArea} = require '../tutor-input'
{CourseStore}   = require '../../flux/course'

module.exports = React.createClass
  displayName: 'TaskPlanBuilder'
  mixins: [PlanMixin, BindStoreMixin, Router.State]
  bindStore: CourseStore
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    {showingPeriods: false}

  # Copies the available periods from the course store and sets
  # them to open at the default start date
  setPeriodDefaults: ->
    {date} = @getQuery() # attempt to read the start date from query params
    opensAt = if date
      moment(date, "MM-DD-YYYY").toDate()
    else
      moment(TimeStore.getNow()).add(1, 'day').toDate()
    course = CourseStore.get(@props.courseId)
    periods = _.map course?.periods, (period) ->
      id: period.id, opens_at: opensAt

    # Inform the store of the available periods
    TaskPlanActions.setPeriods(@props.id, periods)

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
    @setState(showingPeriods: not ev.target.checked)

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
        <BS.Col sm=4 md=3>Open date</BS.Col>
        <BS.Col sm=4 md=3>Due date</BS.Col>
      </BS.Row><BS.Row>

        <BS.Col sm=4 md=3>
          <input
            id='toggle-periods-checkbox'
            type='checkbox'
            onChange={@togglePeriodsDisplay}
            checked={not @state.showingPeriods}/>
          <label className="period" htmlFor='toggle-periods-checkbox'>All Periods</label>
        </BS.Col>

        <BS.Col sm=4 md=3>
          <TutorDateInput
            id='reading-open-date'
            ref="openDate"
            readOnly={TaskPlanStore.isPublished(@props.id)}
            required={true}
            onChange={@setOpensAt}
            value={TaskPlanStore.getOpensAt(@props.id)}/>
        </BS.Col>

        <BS.Col sm=4 md=3>
          <TutorDateInput
            id='reading-due-date'
            ref="dueDate"
            readOnly={TaskPlanStore.isPublished(@props.id)}
            required={true}
            onChange={@setDueAt}
            value={TaskPlanStore.getDueAt(@props.id)}/>
        </BS.Col>
        <BS.Col sm=12 md=3>
          <div className="instructions">Feedback will be released after the due date.</div>
        </BS.Col>

      </BS.Row>

      { _.map(CourseStore.get(@props.courseId)?.periods, @renderTaskPlanRow) if @state.showingPeriods }

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
    </div>

  renderTaskPlanRow: (plan) ->
    if TaskPlanStore.hasTasking(@props.id, plan.id)
      @renderEnabledTasking(plan)
    else
      @renderDisabledTasking(plan)

  renderDisabledTasking: (plan) ->
    <BS.Row key={plan.id} className="task-plan disabled">
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
    <BS.Row key={plan.id} className="task-plan">
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
          required={true}
          onChange={_.partial(@setOpensAt, _, plan)}
          value={TaskPlanStore.getOpensAt(@props.id, plan.id)}/>
      </BS.Col><BS.Col sm=4 md=3>
        <TutorDateInput
          readOnly={TaskPlanStore.isPublished(@props.id)}
          required={true}
          onChange={_.partial(@setDueAt, _, plan)}
          value={TaskPlanStore.getDueAt(@props.id, plan.id)}/>
        </BS.Col>
    </BS.Row>
