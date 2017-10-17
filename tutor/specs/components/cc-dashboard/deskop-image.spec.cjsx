React = require 'react'
_ = require 'underscore'

{default: Courses} = require '../../../src/models/courses-map'

COURSE  = require '../../../api/courses/1.json'
COURSE_ID = '1'

Image = require '../../../src/components/cc-dashboard/desktop-image'
Context = require '../helpers/enzyme-context'


describe 'CC Dashboard desktop image', ->
  beforeEach ->
    Courses.bootstrap([COURSE], { clear: true })
    @props =
      courseId: COURSE_ID

  it 'list a truncated course title', ->
    Courses.get(COURSE_ID).name = 'A long name that should be truncated somewhere'
    image = shallow(<Image {...@props} />, Context.build())
    expect(image).toHaveRendered('text[className="course-name"]')
    expect(image.find('text[className="course-name"]').text()).toEqual('A long name that should be truncated so…')
    undefined
