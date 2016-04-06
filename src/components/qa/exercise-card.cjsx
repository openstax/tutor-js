_ = require 'underscore'
React = require 'react'
classnames = require 'classnames'
{ExerciseStore} = require '../../flux/exercise'
String = require '../../helpers/string'
{ExercisePreview} = require 'openstax-react-components'

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
    {exercise, ignoredTypes, show2StepPreview} = @props
    types = ExerciseStore.getExerciseTypes(exercise)
    return null if _.every( types, (pt) -> ignoredTypes[pt] )

    editUrl = exercise.url.replace(/@\d+/, '@draft')

    if show2StepPreview and ExerciseStore.hasQuestionWithFormat('free-response', {exercise})
      freeResponse = <div className='exercise-free-response-preview'/>

    <ExercisePreview {...@props}
      className='exercise-card'
      header={@renderHeader(types)}
      questionFooter={freeResponse}
      displayAllTags
      displayFeedback
    >
      <a target="_blank" className="edit-link" href={editUrl}>edit</a>
    </ExercisePreview>


module.exports = Exercise
