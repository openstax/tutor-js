_ = require 'underscore'
{ExerciseStore} = require '../flux/exercise'
{ExerciseHelpers} = require 'shared'

TutorHelpers = {

  buildPreviewActions: (exercise, handler, additionalActions) ->
    isExcluded = ExerciseStore.isExerciseExcluded(exercise.id)
    actions = {}
    if isExcluded
      actions.include =
        message: 'Re-Add question'
        handler: handler
    else
      actions.exclude =
        message: 'Remove question'
        handler: handler
    _.extend( actions, additionalActions)

  openReportErrorPage: (exercise) ->
    window.open(@troubleUrl(exerciseId: exercise.content.uid), '_blank')
}

module.exports = _.extend TutorHelpers, ExerciseHelpers
