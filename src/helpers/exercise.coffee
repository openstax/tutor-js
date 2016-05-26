_ = require 'underscore'
{ExerciseStore} = require '../flux/exercise'
{ExerciseHelpers} = require 'openstax-react-components'

TutorHelpers = {

  buildPreviewActions: (exercise, handler, additionalActions) ->
    isExcluded = ExerciseStore.isExerciseExcluded(exercise.id)
    actions = {}
    if isExcluded
      actions.include =
        message: 'ReInclude question'
        handler: handler
    else
      actions.exclude =
        message: 'Exclude question'
        handler: handler
    _.extend( actions, additionalActions)

  openReportErrorPage: (exercise) ->
    window.open(@troubleUrl(exerciseId: exercise.content.uid), '_blank')
}

module.exports = _.extend TutorHelpers, ExerciseHelpers
