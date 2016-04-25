{CourseStore} = require '../flux/course'

module.exports =
  getCourseDataProps: (courseId) ->
    unless courseId?
      {courseId} = @context.params

    dataProps =
      'data-title': CourseStore.getName(courseId)
      'data-appearance': CourseStore.getAppearanceCode(courseId)
