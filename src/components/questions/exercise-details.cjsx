React = require 'react'
BS = require 'react-bootstrap'

{ExerciseStore} = require '../../flux/exercise'
ExerciseCard = require './exercise'
Icon = require '../icon'

ExerciseDetails = React.createClass


  render: ->
    {exercise} = @props

    <div className="exercise-details">

      <div className="page-navigation prev">
        <div className='triangle' />
      </div>

      <div className="controls">
        <a className="show-cards" onClick={@props.onShowCardViewClick}>
          <Icon type="th" /> Back to Card View
        </a>
      </div>

      <ExerciseCard key={exercise.id}

        isExcluded={ExerciseStore.isExerciseExcluded(exercise.id)}

        exercise={exercise}

        interactive={true}

        onExerciseToggle={@onExerciseToggle}
      />

      <div className="page-navigation next">
        <div className='triangle' />
      </div>

    </div>

module.exports = ExerciseDetails
