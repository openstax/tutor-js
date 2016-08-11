{CourseStore} = require '../flux/course'

module.exports =
  getCourseDataProps: (courseId) ->
    unless courseId?
      {courseId} = @context.router.getCurrentParams()

    dataProps =
      'data-title': CourseStore.getName(courseId)
      'data-book-title': CourseStore.getBookName(courseId) or ""
      'data-appearance': CourseStore.getAppearanceCode(courseId)
