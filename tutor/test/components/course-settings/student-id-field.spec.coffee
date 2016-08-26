{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

{RosterActions} = require '../../../src/flux/roster'
StudentIdField  = require '../../../src/components/course-settings/student-id-field'

ROSTER    = require '../../../api/courses/1/roster.json'
STUDENT   = ROSTER.students[0]
COURSE_ID = '1'

describe 'Course Settings update student id', ->

  beforeEach ->
    RosterActions.loaded(ROSTER, COURSE_ID)
    sinon.stub(RosterActions, 'saveStudentIdentifier')
    @props =
      studentId: STUDENT.id
      courseId: COURSE_ID

  afterEach ->
    RosterActions.saveStudentIdentifier.restore()

  it "renders student id by default", ->
    Testing.renderComponent( StudentIdField, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.eq(STUDENT.student_identifier)

  it "switches to editing when icon clicked", ->
    Testing.renderComponent( StudentIdField, props: @props ).then ({dom}) ->
      Testing.actions.click dom.querySelector('a')
      input = dom.querySelector('input')
      expect(input).to.exist
      expect(input.value).to.eq(STUDENT.student_identifier)

  it "saves when input is blurred", ->
    Testing.renderComponent( StudentIdField, props: @props ).then ({dom}) ->
      Testing.actions.click dom.querySelector('a')
      input = dom.querySelector('input')
      ReactTestUtils.Simulate.change(input, {target: {value: 'ONEWORLDID'}})
      ReactTestUtils.Simulate.blur(input, {})
      expect(RosterActions.saveStudentIdentifier).to.have.been
        .calledWith({courseId: COURSE_ID, studentId: STUDENT.id})
