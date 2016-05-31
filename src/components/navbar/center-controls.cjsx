React = require 'react'
moment = require 'moment'
Icon = require '../icon'
{TaskStore} = require '../../flux/task'

module.exports = React.createClass
  displayName: 'CenterControls'
  contextTypes:
    router: React.PropTypes.func

  handleClick: (event) ->
      console.debug('clicked')
      event.preventDefault()

  render: ->
    {courseId, id, stepIndex} = @props.router.getCurrentParams()
    task = TaskStore.get(id)
    return false unless task?
    assignment = task.title
    due = moment(task.due_at).calendar()
    <div className='navbar-overlay'>
      <div className='center-control'>
        {assignment}
        <Icon type='calendar-check-o'
          tooltipProps={placement: 'bottom'}
          tooltip={due} />
        <a href="#" onClick={@handleClick}><Icon type='th' /></a>
      </div>
    </div>
