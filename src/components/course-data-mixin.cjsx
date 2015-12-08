{CourseStore} = require '../flux/course'

module.exports =
  getCourseDataProps: (courseId) ->
    unless courseId?
      {courseId} = @context.router.getCurrentParams()

    dataProps =
      'data-title': CourseStore.getName(courseId)
      'data-appearance': CourseStore.getAppearanceCode(courseId)
