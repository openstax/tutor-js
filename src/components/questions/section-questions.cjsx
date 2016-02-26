React = require 'react'
BS = require 'react-bootstrap'

{TocStore} = require '../../flux/toc'
{ExerciseStore} = require '../../flux/exercise'

ExerciseCard = require '../exercise-card'
ChapterSection = require '../task-plan/chapter-section'
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
        <ExerciseCard toggleExercise={@onExerciseToggle} key={exercise.id} exercise={exercise} />}
      </div>
    </div>


module.exports = SectionsQuestions
