import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import SystemNotifications from 'components/notifications/system';
import Notifications from 'model/notifications';

describe('System Notifications', function() {
  let props = null;

  beforeEach(() =>
    props = {
      onDismiss: sinon.spy(),

      notice: {
        id: '1',
        message: 'a test notice',
        type: 'tutor',
      },
    }
  );

  it('remembers notice as ignored when dismiss is clicked', () =>
    Testing.renderComponent( SystemNotifications, { props } ).then(({ dom }) => {
      Testing.actions.click(dom.querySelector('.dismiss'));
      return expect(props.onDismiss).to.have.been.called;
    })
  );

  it('displays icon based on level', function() {
    props.notice.level = 'alert';
    return Testing.renderComponent( SystemNotifications, { props } ).then(({ dom }) => expect(dom.querySelector('.fa-exclamation-triangle')).to.exist);
  });

  return it('displays icon provided', function() {
    props.notice.icon = 'beer';
    return Testing.renderComponent( SystemNotifications, { props } ).then(({ dom }) => expect(dom.querySelector('.fa-beer')).to.exist);
  });
});
