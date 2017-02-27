CD = require '../../src/helpers/course-data'

mapValues = require 'lodash/mapValues'
TimeHelper = require '../../src/helpers/time'

{CourseActions, CourseStore} = require '../../src/flux/course'

COURSE  = require '../../api/courses/1.json'
COURSE_ID = '1'

describe 'Course Data helpers', ->

  it 'getCourseDataProps', ->
    CourseActions.loaded(COURSE, COURSE_ID)
    expect(CD.getCourseDataProps(COURSE_ID)).toEqual(
      {"data-appearance": "biology", "data-book-title": "Biology", "data-title": "Local Test Course"}
    )

  it 'getCourseBounds', ->
    CourseActions.loaded(COURSE, COURSE_ID)
    bounds = CD.getCourseBounds(COURSE_ID)
    expect(bounds.start).toEqual(
      TimeHelper.getMomentPreserveDate(COURSE.starts_at, TimeHelper.ISO_DATE_FORMAT)
    )
    expect(bounds.end).toEqual(
      TimeHelper.getMomentPreserveDate(COURSE.ends_at, TimeHelper.ISO_DATE_FORMAT)
    )
