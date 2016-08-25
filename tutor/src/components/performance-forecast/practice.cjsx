React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{CoursePracticeStore, CoursePracticeActions} = require '../../flux/practice'

module.exports = React.createClass
  displayName: 'PracticeButton'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    page_ids: React.PropTypes.array.isRequired
    children: React.PropTypes.element.isRequired

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    isWaiting: false
    isDone: false
    isFailed: false
    isDisabled: false

  onClick: ->
    {courseId, page_ids} = @props
    CoursePracticeActions.createSilent(courseId, {page_ids})
    CoursePracticeStore.on('change', @updateState)
    @setState(isWaiting: true)

  componentWillUnmount: ->
    CoursePracticeStore.off('change', @updateState)

  isMatch: (courseId, params, props) ->
    props ?= @props
    props.courseId is courseId and _.isEqual(_.pick(props, 'page_ids'), params)

  updateState: (courseId, params) ->
    return unless @isMatch(courseId, params)

    CoursePracticeStore.off('change', @updateState)

    if CoursePracticeStore.isFailed(courseId)
      @setState(isWaiting: false, isDisabled: true, isFailed: true)
    else if CoursePracticeStore.isLoaded(courseId)
      taskId = CoursePracticeStore.getTaskId(courseId, params)
      @context.router.transitionTo('viewPractice', {courseId}, _.extend({taskId}, params))
      @setState(isWaiting: false, isDone: true)

  isDisabled: ->
    {page_ids, courseId} = @props
    _.isEmpty(page_ids) or
      CoursePracticeStore.isDisabled(courseId, {page_ids}) or
      @state.isDisabled

  render: ->
    isDisabled = @isDisabled()
    {isWaiting, isDone, isFailed} = @state

    props = {isDisabled, isWaiting, isDone, isFailed, onClick: @onClick}

    disabledProps =
      isDisabled: true
      isWaiting: false
    disabledPractice = React.addons.cloneWithProps(@props.children, disabledProps)
    props.waitingText = disabledPractice
    props.failedState = disabledPractice

    React.addons.cloneWithProps(@props.children, props)
