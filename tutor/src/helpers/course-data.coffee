{CourseStore} = require '../flux/course'
Router = require '../helpers/router'
TimeHelper = require '../helpers/time'

module.exports =

  getCourseDataProps: (courseId) ->
    unless courseId?
      {courseId} = Router.currentParams()

    dataProps =
      'data-title': CourseStore.getName(courseId)
      'data-book-title': CourseStore.getBookName(courseId) or ""
      'data-appearance': CourseStore.getAppearanceCode(courseId)

  getCourseBounds: (courseId) ->
    course = CourseStore.get(courseId)

    start = TimeHelper.getMomentPreserveDate(course.starts_at, TimeHelper.ISO_DATE_FORMAT)
    end = TimeHelper.getMomentPreserveDate(course.ends_at, TimeHelper.ISO_DATE_FORMAT)

    {start, end}
