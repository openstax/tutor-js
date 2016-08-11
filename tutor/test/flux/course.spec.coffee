{expect} = require 'chai'
{CourseActions, CourseStore} = require '../../src/flux/course'

COURSE  = require '../../api/courses/1.json'
COURSE_ID = '1'

describe 'Course Store', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)

  it 'retrieves the course name based on the appearance code', ->
    expect(CourseStore.getBookName(COURSE_ID)).to.be.equal('Biology')
