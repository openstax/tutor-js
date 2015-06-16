React = require 'react'
_ = require 'underscore'
moment = require 'moment'
BS = require 'react-bootstrap'
PlanMixin = require './plan-mixin'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TutorInput, TutorDateInput, TutorTextArea} = require '../tutor-input'
{CourseStore}   = require '../../flux/course'

module.exports = React.createClass
  displayName: 'TaskPlanBuilder'
  mixins: [PlanMixin]
  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    {showingPeriods: true}

  togglePeriodsDisplay: (ev) ->
    @setState(showingPeriods: not ev.target.checked)

  renderPeriodsToggle: (columns) ->
    <BS.Col xs=12 sm={columns}>
      <input
        id='toggle-periods-checkbox'
        type='checkbox'
        disabled
        onChange={@togglePeriodsDisplay}
        checked={not @state.showingPeriods}/>
      <label className="all-periods" htmlFor='toggle-periods-checkbox'>All Periods</label>
    </BS.Col>

  setDescription:(desc, descNode) ->
    {id} = @props
    TaskPlanActions.updateDescription(id, desc)

  renderPeriodRow: (period) ->
    <tr key={period.id}>
      <td>{period.name}</td>
      <td>
        <TutorDateInput
          id='reading-open-date'
          readOnly={TaskPlanStore.isPublished(@props.planId)}
          required={true}
          onChange={_.partial @setOpensAt, period}
          max={TaskPlanStore.getDueAt(@props.planId, period.id)}
          value={period.open_at}/>
      </td><td>
        <TutorDateInput
          id='reading-due-date'
          readOnly={TaskPlanStore.isPublished(@props.planId)}
          required={true}
          onChange={_.partial @setDueAt, period}
          min={TaskPlanStore.getOpensAt(@props.planId, period.id)}
          value={period.due_at}/>
      </td>
    </tr>

  renderName: (plan) ->
    <TutorInput
      label='Assignment Name'
      className='assignment-name'
      value={plan.title}
      id='reading-title'
      default={plan.title}
      required={true}
      onChange={@setTitle} />

  renderDescription: ->
    <TutorTextArea
      label='Description'
      className='assignment-description'
      id='assignment-description'
      default={TaskPlanStore.getDescription(@props.planId)}
      onChange={@setDescription} />


  renderShownPeriods: (plan) ->
    {periods} = CourseStore.get(@props.courseId)
    <BS.Row className="assignment">
      <BS.Col md={12} lg={6}>
        <BS.Col xs={12}>
          {@renderName(plan)}
        </BS.Col>
        <BS.Col xs={12}>
          {@renderDescription()}
        </BS.Col>
      </BS.Col>

      <BS.Col md=12 lg=6>
        {@renderPeriodsToggle(12)}
        <table className="periods-listing">
          <thead>
            <tr>
              <th>Name</th>
              <th>Opens</th>
              <th>Closes</th>
            </tr>
          </thead>
          <tbody>
            { _.map periods, @renderPeriodRow }
          </tbody>
        </table>
      </BS.Col>
    </BS.Row>

  renderHiddenPeriods: (plan) ->
    <BS.Row className="assignment">
      <BS.Row>
        <BS.Col md={12} lg={6}>
          {@renderName(plan)}
        </BS.Col>
        <BS.Col md=12 lg=6>
          {@renderPeriodsToggle(4)}
          <BS.Col xs=12 sm=4>
            <TutorDateInput
              id='reading-open-date'
              label='Open Date'
              readOnly={TaskPlanStore.isPublished(@props.planId)}
              required={true}
              onChange={@setOpensAt}
              value={TaskPlanStore.getOpensAt(@props.planId)}/>
            <div className="instructions">Open time is 12:01am</div>
            <div className="instructions">Set date to today to open immediately.</div>
          </BS.Col>

          <BS.Col xs=6 sm=4>
            <TutorDateInput
              id='reading-due-date'
              label='Due Date'
              readOnly={TaskPlanStore.isPublished(@props.planId)}
              required={true}
              onChange={@setDueAt}
              min={TaskPlanStore.getOpensAt(@props.planId)}
              value={plan?.due_at}/>
            <div className="instructions">Due time is 7:00am</div>
          </BS.Col>
        </BS.Col>
      </BS.Row>
      <BS.Row>
        <BS.Col md=12>
          {@renderDescription()}
        </BS.Col>
      </BS.Row>
    </BS.Row>

  render: ->
    plan = TaskPlanStore.get(@props.planId)
    if @state.showingPeriods then @renderShownPeriods(plan) else @renderHiddenPeriods(plan)
