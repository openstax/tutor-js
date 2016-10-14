{CourseStore} = require '../flux/course'
Router = require '../helpers/router'

module.exports =
  getCourseDataProps: (courseId) ->
    unless courseId?
      {courseId} = Router.currentParams()

    dataProps =
      'data-title': CourseStore.getName(courseId)
      'data-book-title': CourseStore.getBookName(courseId) or ""
      'data-appearance': CourseStore.getAppearanceCode(courseId)
