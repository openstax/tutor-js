import { Testing, _ } from 'shared/specs/helpers';

import EmailNotification from 'components/notifications/email';

describe('Email Notifications', function() {
  let props = null;

  beforeEach(() =>
    props = {
      onDismiss: jest.fn(),

      notice: {
        id: 1,
        value: 'one',
        message: 'a test notice',
        type: 'tutor',
        on: jest.fn(),
        off: jest.fn(),
        sendConfirmation: jest.fn(),
        sendVerification: jest.fn(),
      },
    }
  );

  it('displays verify message initially', () =>
    Testing.renderComponent( EmailNotification, { props } ).then(({ dom }) => {
      expect(dom.textContent).to.contain('Verify now');
      expect(dom.querySelector('input')).not.to.exist;
      Testing.actions.click(dom.querySelector('.action'));
      return expect(props.notice.sendConfirmation).toHaveBeenCalled();
    })
  );

  return it('displays verification input', function() {
    props.notice.verifyInProgress = true;
    return Testing.renderComponent( EmailNotification, { props } ).then(({ dom }) => {
      expect(dom.querySelector('input')).to.exist;
      expect(dom.textContent).to.contain('Check your email');
      dom.querySelector('input').value = '123456';
      Testing.actions.click(dom.querySelector('.action'));
      return expect(props.notice.sendVerification).toHaveBeenCalledWith('123456', expect.anything());
    });
  });
});
