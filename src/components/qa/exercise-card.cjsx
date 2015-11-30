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
    return null if _.every( ExerciseStore.poolTypes(@props.exercise), (pt) => @props.ignoredPoolTypes[pt] )
    editUrl = @props.exercise.url.replace(/@\d+/, '@draft')
    <ExerciseCard {...@props} header={@renderHeader()} displayFeedback>
      <a target="_blank" className="edit-link" href={editUrl}>edit</a>
    </ExerciseCard>


module.exports = Exercise
