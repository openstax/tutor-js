{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'
{ChangeStudentIdForm} = require 'shared'

describe 'ChangeStudentIdForm Component', ->
  props = null

  beforeEach ->
    props =
      onCancel: sinon.spy()
      onSubmit: sinon.spy()
      label: 'a test label'
      saveButtonLabel: 'this is save btn'
      title: 'this is title'

  it 'renders values from props', ->
    Testing.renderComponent( ChangeStudentIdForm, props: props ).then ({dom}) =>
      expect(dom.querySelector('.title').textContent).to.equal(props.title)
      expect(dom.querySelector('.control-label').textContent).to.equal(props.label)
      expect(dom.querySelector('.btn').textContent).to.equal(props.saveButtonLabel)

  it 'calls onSubmit when save button is clicked', ->
    Testing.renderComponent( ChangeStudentIdForm, props: props ).then ({dom}) =>
      expect(props.onSubmit).not.to.have.been.called
      dom.querySelector('input').value = 'test value'
      Testing.actions.click(dom.querySelector('.btn'))
      expect(props.onSubmit).to.have.been.called

  it 'calls onCancel when cancel button is clicked', ->
    Testing.renderComponent( ChangeStudentIdForm, props: props ).then ({dom}) =>
      expect(props.onCancel).not.to.have.been.called
      Testing.actions.click(dom.querySelector('.cancel a'))
      expect(props.onCancel).to.have.been.called
