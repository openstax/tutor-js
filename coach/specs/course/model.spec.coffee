{Testing, expect, sinon, _} = require 'shared/specs/helpers'

Course = require 'course/model'

DATA = require '../../auth/status/GET'

describe 'Course Model', ->

  beforeEach ->
    @course = new Course(_.first(DATA.courses))

  it 'can describe itself', ->
    expect(@course.description()).to.eq('Biology I 1st')
    undefined

  it 'gets the student record', ->
    expect(@course.getStudentIdentifier()).to.eq('1324')
    undefined

  it 'sets student id when registering', ->
    @course._onConfirmed(data: {student_identifier: 'ABCDEF'})
    expect(@course.getStudentIdentifier()).to.eq('ABCDEF')
    undefined

  it 'sets student id after modification is performed', ->
    @course._onStudentUpdated(data: {student_identifier: 'WXYZ'})
    expect(@course.getStudentIdentifier()).to.eq('WXYZ')
    undefined
