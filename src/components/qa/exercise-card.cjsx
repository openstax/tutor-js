_ = require 'underscore'
React = require 'react'
classnames = require 'classnames'
{ExerciseStore} = require '../../flux/exercise'
String = require '../../helpers/string'
ExerciseCard = require '../exercise-card'

Exercise = React.createClass

  propTypes:
    exercise: React.PropTypes.object.isRequired
    ignoredTypes: React.PropTypes.object.isRequired

  renderHeader: (types) ->
    <div className='types'>
      {for type in types
        className = classnames(type, {'is-ignored': @props.ignoredTypes[type]})
        <span key={type} className={className}>{String.titleize(type)}</span>}
    </div>

  render: ->
    types = ExerciseStore.getExerciseTypes(@props.exercise)
    return null if _.every( types, (pt) => @props.ignoredTypes[pt] )
    editUrl = @props.exercise.url.replace(/@\d+/, '@draft')
    <ExerciseCard {...@props}
      header={@renderHeader(types)}
      displayAllTags
      displayFeedback
    >
      <a target="_blank" className="edit-link" href={editUrl}>edit</a>
    </ExerciseCard>


module.exports = Exercise
