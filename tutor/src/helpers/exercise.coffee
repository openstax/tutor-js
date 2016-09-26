_ = require 'underscore'
{ExerciseStore} = require '../flux/exercise'
{ExerciseHelpers} = require 'shared'

TutorHelpers = {

  openReportErrorPage: (exercise) ->
    window.open(@troubleUrl(exerciseId: exercise.content.uid), '_blank')

}

module.exports = _.extend TutorHelpers, ExerciseHelpers
