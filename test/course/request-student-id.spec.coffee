{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

Course = require 'course/model'
RequestStudentId = require 'course/request-student-id'

describe 'RequestStudentId Component', ->

  beforeEach ->
    @props =
      onCancel: sinon.spy()
      onSubmit: sinon.spy()
      label: 'a test label'
      saveButtonLabel: 'this is save btn'
      title: 'this is title'
      course: new Course(ecosystem_book_uuid: 'test-collection-uuid')

  it 'renders values from props', ->
    Testing.renderComponent( RequestStudentId, props: @props ).then ({dom}) =>
      expect(dom.querySelector('h3').textContent).to.equal(@props.title)
      expect(dom.querySelector('.control-label').textContent).to.equal(@props.label)
      expect(dom.querySelector('.btn-default').textContent).to.equal(@props.saveButtonLabel)

  it 'calls onSubmit when save button is clicked', ->
    Testing.renderComponent( RequestStudentId, props: @props ).then ({dom}) =>
      expect(@props.onSubmit).not.to.have.been.called
      dom.querySelector('input').value = 'test value'
      Testing.actions.click(dom.querySelector('.btn-default'))
      expect(@props.onSubmit).to.have.been.calledWith('test value')

  it 'calls onCancel when cancel button is clicked', ->
    Testing.renderComponent( RequestStudentId, props: @props ).then ({dom}) =>
      expect(@props.onCancel).not.to.have.been.called
      Testing.actions.click(dom.querySelector('.cancel .btn'))
      expect(@props.onCancel).to.have.been.called
