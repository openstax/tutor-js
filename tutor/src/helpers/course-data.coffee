{default: Courses} = require '../models/courses-map'

Router = require '../helpers/router'
TimeHelper = require '../helpers/time'

module.exports =

  getCourseDataProps: (courseId) ->
    unless courseId?
      {courseId} = Router.currentParams()
    course = Courses.get(courseId)
    dataProps =
      'data-title': course.name
      'data-book-title': course.bookName or ""
      'data-appearance': course.appearance_code

  getCourseBounds: (courseId) ->
    course = Courses.get(courseId)

    start = TimeHelper.getMomentPreserveDate(course.starts_at, TimeHelper.ISO_DATE_FORMAT)
    end = TimeHelper.getMomentPreserveDate(course.ends_at, TimeHelper.ISO_DATE_FORMAT)

    {start, end}
