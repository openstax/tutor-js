CD = require '../../src/helpers/course-data'

mapValues = require 'lodash/mapValues'
TimeHelper = require '../../src/helpers/time'
{ default: Courses } = require '../../src/models/courses-map'

COURSE  = require '../../api/courses/1.json'
COURSE_ID = '1'

describe 'Course Data helpers', ->

  it 'getCourseDataProps', ->
    cd = Courses.bootstrap([COURSE], { clear: true })
    expect(cd.get(COURSE_ID)).not.toBeUndefined()
    expect(CD.getCourseDataProps(COURSE_ID)).toEqual(
      {"data-appearance": "biology", "data-book-title": "Biology", "data-title": "Local Test Course"}
    )

  it 'getCourseBounds', ->
    Courses.bootstrap([COURSE], { clear: true })
    bounds = CD.getCourseBounds(COURSE_ID)
    expect(bounds.start).toEqual(
      TimeHelper.getMomentPreserveDate(COURSE.starts_at, TimeHelper.ISO_DATE_FORMAT)
    )
    expect(bounds.end).toEqual(
      TimeHelper.getMomentPreserveDate(COURSE.ends_at, TimeHelper.ISO_DATE_FORMAT)
    )
