_ = require 'underscore'
React = require 'react'

{ExerciseStore} = require '../../flux/exercise'
String = require '../../helpers/string'
ExerciseCard = require '../exercise-card'

Exercise = React.createClass

  propTypes:
    exercise: React.PropTypes.object.isRequired

  renderHeader: ->
    <div className='pools'>
      {for pool in ExerciseStore.poolTypes(@props.exercise)
        <span key={pool} className={pool}>{String.titleize(pool)}</span>}
    </div>

  render: ->
    <ExerciseCard {...@props} header={@renderHeader()} displayAll />


module.exports = Exercise
