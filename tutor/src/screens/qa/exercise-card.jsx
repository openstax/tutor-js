_ = require 'underscore'
React = require 'react'
classnames = require 'classnames'
{ExerciseStore} = require '../../flux/exercise'
String = require '../../helpers/string'
{ExercisePreview} = require 'shared'
exerciseDataFilter = require '../../flux/qa-exercise-data-filter'
Exercise = React.createClass
  displayName: 'QAExercise'
  propTypes:
    exercise: React.PropTypes.object.isRequired
    ignoredTypes: React.PropTypes.object.isRequired
    ecosystemId: React.PropTypes.string.isRequired
    section: React.PropTypes.string.isRequired
    cnxId: React.PropTypes.string.isRequired

  renderHeader: (types) ->
    <div className='types'>
      {for type in types
        className = classnames(type, {'is-ignored': @props.ignoredTypes[type]})
        <span key={type} className={className}>{String.titleize(type)}</span>}
    </div>

  render: ->
    {exercise, ignoredTypes, show2StepPreview} = @props
    types = ExerciseStore.getExerciseTypes(exercise)

    return null if _.any(types) and _.every( types, (pt) -> ignoredTypes[pt] )

    editUrl = exercise.url.replace(/@\d+/, '@draft')

    doQuestionsHaveFormat = ExerciseStore.doQuestionsHaveFormat('free-response', {exercise})

    if show2StepPreview
      freeResponse = _.map doQuestionsHaveFormat, (hasFreeResponse) ->
        <div className='exercise-free-response-preview'/> if hasFreeResponse

    <ExercisePreview
      exercise={exerciseDataFilter(exercise, @props)}
      className='exercise'
      header={@renderHeader(types)}
      displayFormats={true}
      questionFooters={freeResponse}
      displayAllTags
      displayFeedback
    >
      <a target="_blank" className="edit-link" href={editUrl}>edit</a>
    </ExercisePreview>


module.exports = Exercise
