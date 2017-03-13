_ = require 'underscore'
{ExerciseStore} = require '../flux/exercise'
{ExerciseHelpers} = require 'shared'
{CourseStore} = require '../flux/course'


TutorHelpers = {

  openReportErrorPage: (exercise, courseId, ecosystemId) ->

    window.open(
      @troubleUrl(_.extend({
        project: 'tutor',
        bookUUID: CourseStore.getBookUUID(courseId),
        exerciseId: exercise.content.uid
      }, ExerciseStore.getSectionInfo(ecosystemId, exercise)))
    , '_blank')

}

module.exports = _.extend TutorHelpers, ExerciseHelpers
