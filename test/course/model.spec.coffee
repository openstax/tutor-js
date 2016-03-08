{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

Course = require 'course/model'

DATA = require '../../auth/status/GET'

describe 'Course Model', ->

  beforeEach ->
    @course = new Course(_.first(DATA.courses))

  it 'can describe itself', ->
    expect(@course.description()).to.eq('Biology I 1st')


  it 'gets the student record', ->
    expect(@course.getStudentIdentifier()).to.deep.eq('1324')
