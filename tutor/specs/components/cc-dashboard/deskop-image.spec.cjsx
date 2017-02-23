React = require 'react'
_ = require 'underscore'

{CourseStore, CourseActions} = require '../../../src/flux/course'

COURSE  = require '../../../api/courses/1.json'
COURSE_ID = '1'

Image = require '../../../src/components/cc-dashboard/desktop-image'
Context = require '../helpers/enzyme-context'


describe 'CC Dashboard desktop image', ->
  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    @props =
      courseId: COURSE_ID

  it 'list a truncated course title', ->
    course = _.extend({}, COURSE, name: 'A long name that should be truncated somewhere')
    CourseActions.loaded(course, COURSE_ID)
    image = shallow(<Image {...@props} />, Context.build())
    expect(image).toHaveRendered('text[className="course-name"]')
    expect(image.find('text[className="course-name"]').text()).toEqual('A long name that should be truncated so…')
    undefined
