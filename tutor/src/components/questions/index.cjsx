React = require 'react'

{TocStore, TocActions} = require '../../flux/toc'
{CourseStore} = require '../../flux/course'
LoadableItem = require '../loadable-item'
{UnsavedStateMixin} = require '../unsaved-state'
{ExerciseStore} = require '../../flux/exercise'

showDialog = require './unsaved-dialog'
Dashboard = require './dashboard'



QuestionsDashboardShell = React.createClass

  contextTypes:
    router: React.PropTypes.func
  mixins: [UnsavedStateMixin]
  hasUnsavedState: ->
    ExerciseStore.hasUnsavedExclusions()

  statics:
    # Called before the Router unmounts and transistions to another screen
    willTransitionFrom: (transition, element) ->
      return if element.transitionConfirmed or not element.hasUnsavedState()
      transition.abort()
      showDialog('Are you sure you want to leave the Question Library?').then ->
        element.transitionConfirmed = true
        transition.retry()

  render: ->
    {courseId} = @context.router.getCurrentParams()
    ecosystemId = CourseStore.get(courseId).ecosystem_id

    <LoadableItem
      id={ecosystemId}
      store={TocStore}
      actions={TocActions}
      renderItem={-> <Dashboard courseId={courseId} ecosystemId={ecosystemId} />}
    />

module.exports = QuestionsDashboardShell
