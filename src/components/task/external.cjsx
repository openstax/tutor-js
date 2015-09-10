React = require 'react'


{TaskStore, TaskActions} = require '../../flux/task'
{TaskStepActions} = require '../../flux/task-step'

LoadableItem = require '../loadable-item'

# This component will only be mounted if the external link
# was right-clicked on and opened in a new tab.
#
# Normal "left-click" usage of the link will be intercepted
# and the external task opened immediately
ExternalTask = React.createClass

  getDefaultProps: ->
    redirectToUrl: (url) -> window.location.href = url

  props:
    taskId: React.PropTypes.string.isRequired

  componentWillMount: ->
    step = TaskStore.getExternalStep(@props.taskId)
    TaskStepActions.complete(step.id)
    @props.redirectToUrl(step.external_url)

  render: ->
    step = TaskStore.getExternalStep(@props.taskId)
    <h3>Redirecting to <a href={step.external_url}>{step.external_url}</a></h3>


# The teacher student store depends on both the
# performance report store as well as the teacher student learning guide
ExternalTaskShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {taskId} = @context.router.getCurrentParams()
    <LoadableItem
      id={taskId}
      store={TaskStore}
      actions={TaskActions}
      renderItem={-> <ExternalTask taskId={taskId}/>}
    />


module.exports = {ExternalTaskShell, ExternalTask}
