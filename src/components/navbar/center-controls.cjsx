React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment'
classnames = require 'classnames'

Icon = require '../icon'
{TaskStore} = require '../../flux/task'


module.exports = React.createClass
  displayName: 'CenterControls'
  contextTypes:
    router: React.PropTypes.func

  componentDidMount: ->
    TaskStore.on('change', @update)

  update: ->
    @setState(updateOnNext: true)

  handleClick: (event) ->
    event.preventDefault()
    @toggleMilestones()

  hasMilestones: ->
    @context.router.getCurrentParams().milestones?

  toggleMilestones: ->
    params = @context.router.getCurrentParams()

    if @hasMilestones()
      toParams = _.omit(params, 'milestones')
      path = 'viewTaskStep'
    else
      toParams = _.extend({milestones: 'milestones'}, params)
      path = 'viewTaskStepMilestones'

    @context.router.transitionTo(path, toParams)

  render: ->
    return null unless @context?.router
    {id} = @context.router.getCurrentParams()
    task = TaskStore.get(id)
    return null unless task? and task.type is 'reading'
    assignment = task.title
    due = moment(task.due_at).calendar()

    milestonesToggleClasses = classnames 'milestones-toggle',
      'active': @hasMilestones()

    <div className='navbar-overlay'>
      <div className='center-control'>
        {assignment}
        <Icon type='calendar-check-o'
          tooltipProps={placement: 'bottom'}
          tooltip={due} />
        <BS.Button
          bsStyle='link'
          onClick={@handleClick}
          className={milestonesToggleClasses}>
          <Icon type='th'/>
        </BS.Button>
      </div>
    </div>
