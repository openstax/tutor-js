_ = require 'underscore'
React = require 'react'
classnames = require 'classnames'
{ExerciseStore} = require '../../flux/exercise'
String = require '../../helpers/string'
ExerciseCard = require '../exercise-card'

Exercise = React.createClass

  propTypes:
    exercise: React.PropTypes.object.isRequired
    ignoredPoolTypes: React.PropTypes.object.isRequired

  renderHeader: ->
    <div className='pools'>
      {for pool in ExerciseStore.poolTypes(@props.exercise)
        className = classnames(pool, {'is-ignored': @props.ignoredPoolTypes[pool]})
        <span key={pool} className={className}>{String.titleize(pool)}</span>}
    </div>

  render: ->
    <ExerciseCard {...@props} header={@renderHeader()} displayFeedback />


module.exports = Exercise
