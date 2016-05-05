React = require 'react'

{TocStore, TocActions} = require '../../flux/toc'
{CourseStore} = require '../../flux/course'
LoadableItem = require '../loadable-item'
{UnsavedStateMixin} = require '../unsaved-state'
{ExerciseStore} = require '../../flux/exercise'
TutorDialog = require '../tutor-dialog'


Dashboard = require './dashboard'
showDialog = ->
  body =
    <div>
      <h4>You have excluded exercises that have not been saved</h4>
      <p className="lead">Are you sure you want to leave the Question Library?</p>
    </div>
  TutorDialog.show({
    title: null, body
  })


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
      showDialog().then ->
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
