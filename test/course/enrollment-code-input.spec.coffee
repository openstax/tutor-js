{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

EnrollmentCodeInput = require 'course/enrollment-code-input'
Course = require 'course/model'
STATUS = require '../../auth/status/GET'

describe 'EnrollmentCodeInput Component', ->

  beforeEach ->
    @props =
      title: 'Join my Course'
      course: new Course(ecosystem_book_uuid: 'test-uuid')
      currentCourses: _.map STATUS.courses, (c) -> new Course(c)

  it 'lists current courses', ->
    @props.optionalStudentId = true
    Testing.renderComponent( EnrollmentCodeInput, props: @props ).then ({dom}) ->
      courses = _.pluck(dom.querySelectorAll('.list-group-item'), 'textContent')
      expect(courses).to.deep.equal(['Biology I 1st'])

  it 'model registers when submit is clicked', ->
    sinon.stub(@props.course, 'register')
    Testing.renderComponent( EnrollmentCodeInput, props: @props ).then ({dom}) =>
      dom.querySelector('input').value = 'test'
      Testing.actions.click(dom.querySelector('.btn-default'))
      expect(@props.course.register).to.have.been.calledWith('test')

  it 'model registers when enter is pressed in input', ->
    sinon.stub(@props.course, 'register')
    Testing.renderComponent( EnrollmentCodeInput, props: @props ).then ({dom}) =>
      input = dom.querySelector('input')
      input.value = 'test'
      ReactTestUtils.Simulate.keyPress(input, {key: "Enter"})
      expect(@props.course.register).to.have.been.calledWith('test')
