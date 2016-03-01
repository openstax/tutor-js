React = require 'react'
BS = require 'react-bootstrap'

{TocStore} = require '../../flux/toc'
{ExerciseActions, ExerciseStore} = require '../../flux/exercise'
Dialog = require '../tutor-dialog'
ExerciseCard = require '../exercise-card'
ChapterSection = require '../task-plan/chapter-section'
Icon = require '../icon'

QLExerciseCard = React.createClass
  getInitialState: -> {}
  propTypes:
    isExcluded: React.PropTypes.bool
    exercise:   React.PropTypes.object.isRequired

  onExerciseToggle: (ev) ->
    @props.onExerciseToggle(@props.exercise, not @props.isExcluded)

  toggleFeedbackDisplay: ->
    @setState(isShowingFeedback: not @state.isShowingFeedback)

  render: ->
    inc_ex = if @props.isExcluded then 'Reinclude' else 'Exclude'
    <ExerciseCard
      displayFeedback={@state.isShowingFeedback}
      hoverMessage={"#{inc_ex} this question"}
      isSelected={@props.isExcluded}
      toggleExercise={@onExerciseToggle} {...@props}
    >
      <button className="feedback-toggle" onClick={@toggleFeedbackDisplay}>
        <Icon type={(if @state?.isShowingFeedback then 'check-' else '' ) + 'square-o'} />
        Preview Feedback
      </button>
    </ExerciseCard>

SectionsQuestions = React.createClass

  propTypes:
    ecosystemId: React.PropTypes.string.isRequired
    exercises:   React.PropTypes.array.isRequired
    chapter_section: React.PropTypes.string.isRequired

  renderMinimumExclusionWarning: ->
    [
      <Icon key="icon" type="exclamation" />
      <div key="message" className="message">
        <p>
          Tutor needs at least 5 questions for this topic to be
          included in spaced practice and personalized learning.
        </p>
        <p>
          If you exclude too many, your students will not get to practice on this topic.
        </p>
      </div>
    ]
  onExerciseToggle: (exercise, isSelected) ->
    if isSelected and ExerciseStore.isExcludedAtMinimum(@props.exercises)
      Dialog.show(
        className: 'question-library-min-exercise-exclusions'
        title: undefined, body: @renderMinimumExclusionWarning()
        buttons: [
          <BS.Button key='exclude'
            onClick={->
              ExerciseActions.setExerciseExclusion(exercise.id, isSelected)
              Dialog.hide()
            }>Exclude</BS.Button>

          <BS.Button key='cancel' bsStyle='primary'
            onClick={-> Dialog.hide()} bsStyle='primary'>Cancel</BS.Button>
        ]
      )
    else
      ExerciseActions.setExerciseExclusion(exercise.id, isSelected)

  render: ->
    section = TocStore.getSectionLabel(@props.chapter_section)

    <div className='exercise-sections' data-section={section.chapter_section.join('.')}>
      <label className='exercises-section-label'>
        <ChapterSection section={section.chapter_section}/> {section.title}
      </label>
      <div className="exercises">
      {for exercise in @props.exercises
        <QLExerciseCard key={exercise.id}
          isExcluded={ExerciseStore.isExerciseExcluded(exercise.id)}
          exercise={exercise}
          onExerciseToggle={@onExerciseToggle} />}
      </div>
    </div>


module.exports = SectionsQuestions
