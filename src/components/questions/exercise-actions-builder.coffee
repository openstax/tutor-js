_ = require 'underscore'
{ExerciseStore} = require '../../flux/exercise'

module.exports = (exercise, handler, additionalActions) ->
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
