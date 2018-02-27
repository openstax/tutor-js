React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Icon = require '../../icon'
LoadingExercises = require './loading-exercises-mixin'
Exercise = require 'shared/model/exercise'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{ExerciseStore} = require '../../../flux/exercise'
{ExercisePreview, SuretyGuard, PinnedHeaderFooterCard} = require 'shared'

ExerciseControls = require './exercise-controls'
ExerciseTable    = require './exercises-table'

ReviewExerciseCard = React.createClass

  propTypes:
    planId:   React.PropTypes.string.isRequired
    exercise: React.PropTypes.object.isRequired
    canEdit:  React.PropTypes.bool.isRequired
    isFirst:  React.PropTypes.bool.isRequired
    isLast:   React.PropTypes.bool.isRequired
    index:    React.PropTypes.number.isRequired

  moveExerciseUp: ->
    TaskPlanActions.moveExercise(@props.planId, @props.exercise, -1)

  moveExerciseDown: ->
    TaskPlanActions.moveExercise(@props.planId, @props.exercise, 1)

  removeExercise: ->
    TaskPlanActions.removeExercise(@props.planId, @props.exercise)

  getActionButtons: ->
    return null unless @props.canEdit

    <span className="pull-right card-actions">
      {<BS.Button onClick={@moveExerciseUp} className="btn-xs -move-exercise-up circle">
         <Icon type='arrow-up' />
       </BS.Button> unless @props.isFirst}
      {<BS.Button onClick={@moveExerciseDown} className="btn-xs -move-exercise-down circle">
         <Icon type='arrow-down' />
       </BS.Button> unless @props.isLast}
      <SuretyGuard
        title={false}
        onConfirm={@removeExercise}
        okButtonLabel='Remove'
        placement='left'
        message="Are you sure you want to remove this exercise?"
      >
        <BS.Button className="btn-xs -remove-exercise circle">
          <Icon type='close' />
        </BS.Button>
      </SuretyGuard>
    </span>

  renderHeader: ->
    actionButtons = @getActionButtons()
    <span className="-exercise-header">
      <span className="exercise-number">{@props.index + 1}</span>
      {actionButtons}
    </span>

  render: ->
    exercise = new Exercise(@props.exercise.content)
    debugger
    <div className="openstax exercise-wrapper">
      <ExercisePreview
        exercise={exercise}
        className='exercise-card'
        isInteractive={false}
        isVerticallyTruncated={true}
        isSelected={false}
        header={@renderHeader()}
        panelStyle='default'
      />
    </div>


ReviewExercises = React.createClass

  mixins: [LoadingExercises]


  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    canEdit: React.PropTypes.bool
    sectionIds: React.PropTypes.array.isRequired
    showSectionTopics: React.PropTypes.func.isRequired


  render: ->
    return @renderLoading() if @exercisesAreLoading()
    unless TaskPlanStore.getTopics(@props.planId).length
      return <div className='-bug'>Failed loading exercises</div>

    {courseId, sectionIds, planId} = @props

    controls =
      <ExerciseControls
        onCancel={@cancel}
        onPublish={@publish}
        canAdd={@props.canAdd}
        addClicked={@props.showSectionTopics}
        hideDisplayControls
        planId={planId}/>

    exerciseTable =
      <ExerciseTable
        courseId={courseId}
        sectionIds={sectionIds}
        planId={planId}/>

    exercise_ids = TaskPlanStore.getExercises(planId)
    exercises = _.compact _.map(exercise_ids, ExerciseStore.getExerciseById)

    <PinnedHeaderFooterCard
      containerBuffer={50}
      header={controls}
      cardType='homework-builder'>
      {exerciseTable}
      <div className="card-list exercises">
        {for exercise, i in exercises
          <ReviewExerciseCard
            key={exercise.id}
            index={i}
            planId={@props.planId}
            canEdit={@props.canEdit}
            isFirst={i is 0}
            isLast={i is exercises.length - 1}
            exercise={exercise}/>}
      </div>
    </PinnedHeaderFooterCard>



module.exports = ReviewExercises
