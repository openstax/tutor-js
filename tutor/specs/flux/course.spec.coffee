{CourseActions, CourseStore} = require '../../src/flux/course'

COURSE  = require '../../api/courses/1.json'
COURSE_ID = '1'

describe 'Course Store', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)

  it 'retrieves the course name based on the appearance code', ->
    expect(CourseStore.getBookName(COURSE_ID)).to.be.equal('Biology')
    undefined

  it 'retrieves the course subject based on the appearance code', ->
    expect(CourseStore.getSubject(COURSE_ID)).to.be.equal('Biology')
    undefined

  it 'gets the book uuid', ->
    expect(CourseStore.getBookUUID(COURSE_ID)).to.equal('3402dc53-113d-45f3-954e-8d2ad1e73659')
    undefined
