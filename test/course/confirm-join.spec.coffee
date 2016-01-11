{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

ConfirmJoin = require 'course/confirm-join'
Course = require 'course/model'
STATUS = require '../../auth/status/GET'

COURSE = STATUS.courses[0]

describe 'ConfirmJoin Component', ->

  beforeEach ->
    @props =
      title: 'Join my Course'
      course: new Course(COURSE)

  it 'sets title from props', ->
    Testing.renderComponent( ConfirmJoin, props: @props ).then ({dom}) =>
      expect(dom.querySelector('h3').textContent).equal(@props.title)

      expect(dom.querySelector('label').textContent)
        .equal('Enter your school issued ID:')

  it 'changes instructions if optionalStudentId is true', ->
    @props.optionalStudentId = true
    Testing.renderComponent( ConfirmJoin, props: @props ).then ({dom}) ->
      expect(dom.querySelector('label').textContent)
        .equal('Update school issued ID(leave blank to leave unchanged):')

  it 'confirms model when submit is clicked', ->
    sinon.stub(@props.course, 'confirm')
    Testing.renderComponent( ConfirmJoin, props: @props ).then ({dom}) =>
      dom.querySelector('input').value = 'test'
      Testing.actions.click(dom.querySelector('.btn-success'))
      expect(@props.course.confirm).to.have.been.calledWith('test')

  it 'confirms model when enter is pressed in input', ->
    sinon.stub(@props.course, 'confirm')
    Testing.renderComponent( ConfirmJoin, props: @props ).then ({dom}) =>
      input = dom.querySelector('input')
      input.value = 'test'
      ReactTestUtils.Simulate.keyPress(input, {key: "Enter"})
      expect(@props.course.confirm).to.have.been.calledWith('test')
