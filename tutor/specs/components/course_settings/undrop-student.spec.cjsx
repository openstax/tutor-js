{React, Testing, sinon, _, ReactTestUtils} = require '../helpers/component-testing'
{Promise}      = require 'es6-promise'
ld = require 'lodash'

UndropStudent = require '../../../src/components/course-settings/undrop-student'

COURSE = require '../../../api/user/courses/1.json'
ROSTER = require '../../../api/courses/1/roster.json'
STUDENT = _.clone(ROSTER.students[4])
STUDENT.is_active = false
COURSE_ID = '1'

{CourseActions} = require '../../../src/flux/course'
{RosterActions, RosterStore} = require '../../../src/flux/roster'


displayPopover = (props) ->
  new Promise( (resolve, reject) ->
    wrapper = mount(<UndropStudent {...props} />)
    wrapper.simulate('click')
    resolve(_.last document.querySelectorAll('.popover.undrop-student'))
  )

describe 'Course Settings, undrop student', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    RosterActions.loaded(ROSTER, COURSE_ID)
    sinon.stub(RosterActions, 'undrop').returns(null)

    @props =
      student: _.clone(STUDENT)
      courseId: COURSE_ID

  afterEach ->
    RosterActions.undrop.restore()

  it 'displays popover when clicked', ->
    displayPopover(@props).then (dom) ->
      expect(dom.querySelector('.popover-title').textContent).to.include("Add Rabbit")


  it 'undrops student when popover clicked', ->
    displayPopover(@props).then (dom) ->
      Testing.actions.click(dom.querySelector('button'))
      expect(RosterActions.undrop).to.have.been.called


  it 'displays an error message', ->
    sinon.stub(RosterStore, 'getError', ->
      code: 'student_identifier_has_already_been_taken'
    )
    displayPopover(@props).then (dom) ->
      expect(dom.querySelector('.popover-title').textContent).to.include("Student ID is in use")
      expect(dom.querySelector('.popover-content').textContent).to.include('another student is using the same student ID')
      RosterStore.getError.restore()
    , ->
      RosterStore.getError.restore()
