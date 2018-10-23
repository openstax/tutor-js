import { Testing, expect, sinon, _, ReactTestUtils } from 'shared/specs/helpers';
import { ChangeStudentIdForm } from 'shared';

describe('ChangeStudentIdForm Component', function() {
  let props = null;

  beforeEach(() =>
    props = {
      onCancel: sinon.spy(),
      onSubmit: sinon.spy(),
      label: 'a test label',
      saveButtonLabel: 'this is save btn',
      title: 'this is title',
    }
  );

  it('renders values from props', () =>
    Testing.renderComponent( ChangeStudentIdForm, { props } ).then(({ dom }) => {
      expect(dom.querySelector('.title').textContent).to.equal(props.title);
      expect(dom.querySelector('.control-label').textContent).to.equal(props.label);
      return expect(dom.querySelector('.btn').textContent).to.equal(props.saveButtonLabel);
    })
  );

  it('calls onSubmit when save button is clicked', () =>
    Testing.renderComponent( ChangeStudentIdForm, { props } ).then(({ dom }) => {
      expect(props.onSubmit).not.to.have.been.called;
      dom.querySelector('input').value = 'test value';
      Testing.actions.click(dom.querySelector('.btn'));
      return expect(props.onSubmit).to.have.been.called;
    })
  );

  return it('calls onCancel when cancel button is clicked', () =>
    Testing.renderComponent( ChangeStudentIdForm, { props } ).then(({ dom }) => {
      expect(props.onCancel).not.to.have.been.called;
      Testing.actions.click(dom.querySelector('.cancel a'));
      return expect(props.onCancel).to.have.been.called;
    })
  );
});
