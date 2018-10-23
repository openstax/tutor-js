import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import URLs from 'model/urls';
import User from 'model/user';
import UiSettings from 'model/ui-settings';
import Networking from 'model/networking';

describe('User mode', function() {
  let user = null;

  beforeEach(function() {
    sinon.spy(Networking, 'perform');
    URLs.update({ accounts_api_url: 'http://localhost:2999/api' });
    return user = new User({
      contact_infos: [
        { id: 1234, is_verified: false },
      ],
    });
  });

  afterEach(function() {
    UiSettings._reset();
    return Networking.perform.restore();
  });

  it('can request email confirmation', function() {
    const email = _.first(user.unVerfiedEmails());
    expect(email).to.exist;
    email.sendConfirmation();
    expect(Networking.perform).to.have.been.calledWith({
      method: 'PUT',
      url: 'http://localhost:2999/api/contact_infos/1234/resend_confirmation.json',
      silenceErrors: true,
      withCredentials: true,
      data: { send_pin: true },
    });
    return undefined;
  });

  return it('can send an email confirmation', function() {
    const email = _.first(user.unVerfiedEmails());
    email.sendVerification('1234');
    expect(Networking.perform).to.have.been.calledWith({
      method: 'PUT',
      url: 'http://localhost:2999/api/contact_infos/1234/confirm_by_pin.json',
      silenceErrors: true,
      withCredentials: true,
      data: { pin: '1234' },
    });
    return undefined;
  });
});
