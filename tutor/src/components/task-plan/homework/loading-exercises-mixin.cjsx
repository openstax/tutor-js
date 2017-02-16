_     = require 'underscore'
React = require 'react'

{TaskPlanStore} = require '../../../flux/task-plan'
{ExerciseStore, ExerciseActions} = require '../../../flux/exercise'
Icon = require '../../icon'

LoadingExercisesMixin =
  componentWillMount:   ->
    ExerciseStore.addChangeListener(@exerciseLoadListenerOnUpdate)
    @requestExerciseLoad() if @exercisesNeedLoading()

  componentWillUnmount: -> ExerciseStore.removeChangeListener(@exerciseLoadListenerOnUpdate)

  requestExerciseLoad: ->
    ecosystemId = @props.ecosystemId or TaskPlanStore.getEcosystemId(@props.planId, @props.courseId)
    ExerciseActions.loadForCourse(@props.courseId, @props.sectionIds, ecosystemId)

  exercisesNeedLoading: ->
    not _.isEmpty(@props.sectionIds) and
      not (ExerciseStore.isLoaded(@props.sectionIds) or @exercisesAreLoading())

  exercisesAreLoading: ->
    ExerciseStore.isLoading(@props.sectionIds)

  exerciseLoadListenerOnUpdate: ->
    @forceUpdate()

  renderLoading: ->
    <span className="hw-loading-spinner">
      <Icon type='spinner' spin />Loading...
    </span>



module.exports = LoadingExercisesMixin
