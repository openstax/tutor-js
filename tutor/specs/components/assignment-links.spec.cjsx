_              = require 'underscore'
React          = require 'react'

AssignmentLinks = require '../../src/components/assignment-links'
{ReferenceBookActions} = require '../../src/flux/reference-book'
{default: Courses} = require '../../src/models/courses-map'

COURSE_ID = '1'
ECOSYSTEM_ID = '1'
COURSE = require '../../api/user/courses/1.json'
READINGS = require '../../api/ecosystems/1/readings'

{shallow, mount} = require 'enzyme'


describe 'Assignment Links', ->

  beforeEach ->
    Courses.bootstrap([COURSE], { clear: true })
    ReferenceBookActions.loaded(READINGS, ECOSYSTEM_ID)
    @props =
      courseId = COURSE_ID

  it 'renders', ->
    wrapper = mount(<AssignmentLinks {...@props} />)
    for reading in READINGS[0].children
      section = wrapper.find("tr[data-section-id=\"#{reading.id}\"]")
      expect(section).to.have.length(1)
      expect(section.find('.title').text()).equal(reading.title)

    undefined
