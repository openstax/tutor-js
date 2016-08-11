React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'

{ExercisePreview} = require 'shared'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'

ExercisePreviewWrapper = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)
    unless ExerciseStore.isLoading(@props.exerciseId) or ExerciseStore.get(@props.exerciseId)
      ExerciseActions.load(@props.exerciseId)

  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  update: -> @forceUpdate()

  previewData: (ex) ->
    content: ex
    tags: _.map ex.tags, (tag) -> name: tag

  render: ->
    exercise = ExerciseStore.get(@props.exerciseId)
    return null unless exercise
    <div className="exercise-preview">
      <ExercisePreview
        exercise={@previewData(exercise)}
        displayAllTags={true}
        displayFormats={true}
        displayFeedback={true}
        hideAnswers={false}
      />
    </div>

module.exports = ExercisePreviewWrapper
