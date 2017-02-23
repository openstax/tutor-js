CD = require '../../src/helpers/course-data'

mapValues = require 'lodash/mapValues'

{CourseActions, CourseStore} = require '../../src/flux/course'

COURSE  = require '../../api/courses/1.json'
COURSE_ID = '1'

describe 'Course Data helpers', ->

  it 'getCourseNameSegments', ->
    expect(CD.getCourseNameSegments({name: 'a physics course'}, 'Physics')).toEqual(
      ["a", "physics", "course"]
    )
    expect(CD.getCourseNameSegments({name: 'physics course'}, 'Physics')).toEqual(
      ["", "physics", "course"]
    )
    expect(CD.getCourseNameSegments({name: 'Dr Goods physics'}, 'Physics')).toEqual(
      ["Dr Goods", "physics", ""]
    )
    expect(CD.getCourseNameSegments({name: 'A Long Preamble about physics, then some stuff at end'}, 'Physics')).toEqual(
      ["A Long Preamble about", "physics", "then some stuff at end"]
    )
    # extra chars on start/end
    expect(CD.getCourseNameSegments({name: 'a physicss course'}, 'Physics')).toBeUndefined()
    expect(CD.getCourseNameSegments({name: 'aphysics course'}, 'Physics')).toBeUndefined()

  it 'getCourseDataProps', ->
    CourseActions.loaded(COURSE, COURSE_ID)
    expect(CD.getCourseDataProps(COURSE_ID)).toEqual(
      {"data-appearance": "biology", "data-book-title": "Biology", "data-title": "Local Test Course"}
    )

  it 'getCourseBounds', ->
    CourseActions.loaded(COURSE, COURSE_ID)
    expect(mapValues(CD.getCourseBounds(COURSE_ID), (m) -> m.toString())).toEqual(
        {"end": "Sat Dec 31 2016 12:00:00 GMT-0600", "start": "Fri Jul 01 2016 12:00:00 GMT-0500"}
      )
