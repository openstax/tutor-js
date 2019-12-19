import { ChangeStudentIdForm } from 'shared';

describe('ChangeStudentIdForm Component', function() {
  let props = null;

  beforeEach(() => {
    props = {
      onCancel: jest.fn(),
      onSubmit: jest.fn(),
      label: 'a test label',
      saveButtonLabel: 'this is save btn',
      title: 'this is title',
    };
  });

  it('renders values from props', () => {
    expect.snapshot(<ChangeStudentIdForm {...props} />).toMatchSnapshot();
  });

  it('calls onSubmit when save button is clicked', () => {
    const csid = mount(<ChangeStudentIdForm {...props} />);
    csid.find('input').instance().value = '123456';
    csid.find('Button').simulate('click');
    expect(props.onSubmit).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const csid = mount(<ChangeStudentIdForm {...props} />);
    csid.find('input').instance().value = '123456';
    csid.find('.cancel a').simulate('click');
    expect(props.onCancel).toHaveBeenCalled();
  });
});
