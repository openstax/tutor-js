_ = require 'underscore'
{ExerciseStore} = require '../flux/exercise'
{ExerciseHelpers} = require 'shared'
{CourseStore} = require '../flux/course'


TutorHelpers = {

  openReportErrorPage: (exercise, courseId) ->

    window.open(
      @troubleUrl(
        project: 'tutor',
        bookUUID: CourseStore.getBookUUID(courseId),
        exerciseId: exercise.content.uid
      )
    , '_blank')

}

module.exports = _.extend TutorHelpers, ExerciseHelpers
