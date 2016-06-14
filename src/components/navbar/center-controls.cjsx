React = require 'react/addons'
Router = require 'react-router'
moment = require 'moment'
classnames = require 'classnames'
_ = require 'underscore'

Icon = require '../icon'
{TaskStore} = require '../../flux/task'


module.exports = React.createClass
  displayName: 'CenterControls'
  contextTypes:
    router: React.PropTypes.func

  mixins: [React.addons.PureRenderMixin]

  getDefaultProps: ->
    shouldShow: false

  getInitialState: ->
    params = @context.router?.getCurrentParams() or {}
    taskInfo = @getTaskInfo(params)
    controlInfo = @getControlInfo(params)

    _.extend {}, taskInfo, controlInfo

  componentWillMount: ->
    location = @context.router?.getLocation()
    location.addChangeListener(@updateControls) if location
    TaskStore.on('loaded', @updateTask)

  componentWillUnmount: ->
    location = @context.router?.getLocation()
    location.removeChangeListener(@updateControls) if location
    TaskStore.off('loaded', @updateTask)

  shouldShow: (path) ->
    {shouldShow} = @props
    return true if shouldShow
    return false unless @context.router?

    path ?= @context.router.getCurrentPath()
    matchedPath = @context.router.match(path)
    return false unless matchedPath?.routes

    'viewTaskStep' in _.pluck(matchedPath.routes, 'name')

  update: (getState, params, path) ->
    show = @shouldShow(path)
    unless show
      @setState({show})
      return false

    params ?= @context.router.getCurrentParams()

    state = getState(params)
    @setState(state) if state?

  updateControls: ({path}) ->
    {params} = @context.router.match(path)
    @update(@getControlInfo, params, path)

  updateTask: (taskId) ->
    params = @context.router.getCurrentParams()
    @update(@getTaskInfo) if taskId is params.id

  getTaskInfo: (params) ->
    {id} = params
    task = TaskStore.get(id)

    return {show: false} unless task and task?.type is 'reading'

    show: true
    assignment: task.title
    due: @reformatTaskDue(task.due_at)

  reformatTaskDue: (due_at) ->
    moment(due_at).calendar()

  getControlInfo: (params) ->
    hasMilestones = @hasMilestones(params)
    linkParams = @getLinkProps(params, hasMilestones)

    _.extend {}, linkParams, {hasMilestones}

  hasMilestones: (params) ->
    params.milestones?

  getLinkProps: (params, hasMilestones) ->
    return {show: false} unless params.id and params.stepIndex and params.courseId

    if hasMilestones
      params: _.omit(params, 'milestones')
      to: 'viewTaskStep'
    else
      params: _.extend({milestones: 'milestones'}, params)
      to: 'viewTaskStepMilestones'

  render: ->
    {show, assignment, due, hasMilestones} = @state
    return null unless show

    linkProps = _.pick @state, 'to', 'params'

    milestonesToggleClasses = classnames 'milestones-toggle',
      'active': hasMilestones

    <div className='navbar-overlay'>
      <div className='center-control'>
        <span className='center-control-assignment'>
          {assignment}
        </span>

        <Icon type='calendar-check-o'
          tooltipProps={placement: 'bottom'}
          tooltip={due} />
        <Router.Link
          {...linkProps}
          ref='milestonesToggle'
          activeClassName=''
          className={milestonesToggleClasses}>
          <Icon type='th' />
        </Router.Link>
      </div>
    </div>
