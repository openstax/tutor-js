{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

JoinConflict = require 'course/join-conflict'
Course = require 'course/model'
STATUS = require '../../auth/status/GET'

COURSE = STATUS.courses[0]

describe 'JoinConflict Component', ->

  beforeEach ->
    @props = course: new Course(COURSE)

  it 'sets title with course', ->
    Testing.renderComponent( JoinConflict, props: @props ).then ({dom}) ->
      title = dom.querySelector('h3.title').textContent
      expect(title).to.include("You are joining")
      expect(title).to.include("Biology I")

  it 'sets conflict message', ->
    sinon.stub(@props.course, 'conflictDescription').returns('Old course')
    sinon.stub(@props.course, 'conflictTeacherNames').returns('Old instructors')
    Testing.renderComponent( JoinConflict, props: @props ).then ({dom}) ->
      conflicts = dom.querySelector('.conflict .errors').textContent
      expect(conflicts).to.include(
        'You are already enrolled in another OpenStax Concept Coach using this textbook, ' +
        'Old course with Old instructors. To make sure you don\'t lose work, we strongly ' +
        'recommend enrolling in only one Concept Coach per textbook. When you join the new ' +
        'course below, we will remove you from the other course.')

  it 'continues from conflict when submit is clicked', ->
    sinon.stub(@props.course, 'conflictContinue')
    Testing.renderComponent( JoinConflict, props: @props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.btn-success'))
      expect(@props.course.conflictContinue).to.have.been.called

  xit 'continues from conflict when enter is pressed in input', ->
    sinon.stub(@props.course, 'conflictContinue')
    Testing.renderComponent( JoinConflict, props: @props ).then ({dom}) =>
      # keyPress simulation does not work
      ReactTestUtils.Simulate.keyPress(dom.querySelector('.btn-success'), {key: "Enter"})
      expect(@props.course.conflictContinue).to.have.been.called
