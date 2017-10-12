_ = require 'underscore'
{ExerciseStore} = require '../flux/exercise'
{ExerciseHelpers} = require 'shared'
{default: Courses} = require '../models/courses-map'

TutorHelpers = {

  openReportErrorPage: (exercise, courseId, ecosystemId) ->

    window.open(
      @troubleUrl(_.extend({
        project: 'tutor',
        bookUUID: Courses.get(courseId).ecosystem_book_uuid,
        exerciseId: exercise.content.uid
      }, ExerciseStore.getSectionInfo(ecosystemId, exercise)))
    , '_blank')

}

module.exports = _.extend TutorHelpers, ExerciseHelpers
