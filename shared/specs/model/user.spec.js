import { ld } from 'shared/specs/helpers';

import URLs from 'model/urls';
import User from 'model/user';
import UiSettings from 'model/ui-settings';
import Networking from 'model/networking';

describe('User mode', function() {
    let user = null;
    let perform;

    beforeEach(function() {
        perform = jest.spyOn(Networking, 'perform');
        URLs.update({ accounts_api_url: 'http://localhost:2999/api' });
        user = new User({
            contact_infos: [
                { id: 1234, is_verified: false },
            ],
        });
    });

    afterEach(function() {
        UiSettings._reset();
        perform.mockRestore();
    });

    it('can request email confirmation', function() {
        const email = ld.first(user.unVerfiedEmails());
        expect(email).toBeTruthy();
        email.sendConfirmation();
        expect(Networking.perform).toHaveBeenCalledWith({
            method: 'PUT',
            url: 'http://localhost:2999/api/contact_infos/1234/resend_confirmation.json',
            silenceErrors: true,
            withCredentials: true,
            data: { send_pin: true },
        });
    });

    it('can send an email confirmation', function() {
        const email = ld.first(user.unVerfiedEmails());
        email.sendVerification('1234');
        expect(Networking.perform).toHaveBeenCalledWith({
            method: 'PUT',
            url: 'http://localhost:2999/api/contact_infos/1234/confirm_by_pin.json',
            silenceErrors: true,
            withCredentials: true,
            data: { pin: '1234' },
        });
    });
});
