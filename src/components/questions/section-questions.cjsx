React = require 'react'
BS = require 'react-bootstrap'

{TocStore} = require '../../flux/toc'
{ExerciseStore} = require '../../flux/exercise'

ExerciseCard = require '../exercise-card'
ChapterSection = require '../task-plan/chapter-section'
Icon = require '../icon'


QLExerciseCard = React.createClass
  getInitialState: -> {}
  onExerciseToggle: (ev, ex)->
    debugger

  toggleFeedbackDisplay: ->
    @setState(isShowingFeedback: not @state.isShowingFeedback)

  render: ->
    <ExerciseCard
      displayFeedback={@state.isShowingFeedback}
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

  onExerciseToggle: ->
    console.log "toggled", arguments

  render: ->
    section = TocStore.getSectionLabel(@props.chapter_section)

    <div className='exercise-sections' data-section={section.chapter_section.join('.')}>
      <label className='exercises-section-label'>
        <ChapterSection section={section.chapter_section}/> {section.title}
      </label>
      <div className="exercises">
      {for exercise in @props.exercises
        <QLExerciseCard key={exercise.id} exercise={exercise} />}
      </div>
    </div>


module.exports = SectionsQuestions
