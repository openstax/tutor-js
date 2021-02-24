import { ld } from '../../helpers';
import FakeWindow from 'shared/specs/helpers/fake-window';
import Notifications from 'model/notifications';
import UiSettings from 'model/ui-settings';
import moment from 'moment';
import TEST_NOTICES from '../../../api/notifications';
import Poller from 'model/notifications/pollers';

jest.mock('model/notifications');
jest.mock('model/ui-settings');

describe('Notification Pollers', function() {
    let notices = null;
    let tutor = null;
    let accounts = null;
    let pollers = null;

    beforeEach(function() {
        notices = Notifications;
        notices.windowImpl = new FakeWindow;

        tutor = Poller.forType(notices, 'tutor');
        tutor.onReply({
            data: {
                notifications: [
                    { id: 'test', message: 'A test notice' },
                ],
            },
        });

        accounts = Poller.forType(notices, 'accounts');
        accounts.onReply({
            data: {
                contact_infos: [
                    { id: 1234, is_verified: false },
                ],
            },
        });
        return pollers = [tutor, accounts];
    });


    it('polls when url is set', function() {
        for (let poller of pollers) {
            expect(notices.windowImpl.setInterval).not.toHaveBeenCalled();
            poller.setUrl('/test');
            expect(poller.url).toEqual('/test');
            expect(notices.windowImpl.setInterval).toHaveBeenCalled();
            notices.windowImpl.setInterval.mockClear();
        }
    });

    it('returns list of active notices', function() {
        expect(tutor.getActiveNotifications()).toEqual([
            { id: 'test', message: 'A test notice', type: 'tutor' },
        ]);
        expect(accounts.getActiveNotifications()).toMatchObject([
            { id: 1234, is_verified: false, type: 'accounts' },
        ]);
    });

    it('remembers when acknowledged', function() {
        for (let poller of pollers) {
            const notice = ld.first(poller.getActiveNotifications());
            poller.acknowledge(notice);
            expect(UiSettings.set).toHaveBeenLastCalledWith(`ox-notifications-${poller.type}`, [notice.id]);
        }
    });

    it('does not list items that are already acknowledged', function() {
        UiSettings.get.mockReturnValue(['2']);
        tutor.onReply({ data: TEST_NOTICES });
        const active = tutor.getActiveNotifications();
        expect( ld.map(active, 'id') ).toEqual(['1']); // no id "2"
    });

    it('removes outdated ids from prefs', function() {
    // mock that we've observed the current notices
        UiSettings.get.mockReturnValue(['1', '2']);
        tutor.onReply({ data: TEST_NOTICES });

        // load a new set of messages that do not include the previous ones
        tutor.onReply({
            data: { notifications: [{ id: '3', message: 'message three' }] },
        });
        // 1 and 2 are removed
        expect(UiSettings.set).toHaveBeenLastCalledWith('ox-notifications-tutor', []);
    });

    it('polls when becomes visible', () => {
        notices.windowImpl.document.hidden = true;
        expect(tutor.shouldPoll).toBe(false);
        notices.windowImpl.document.hidden = false;
        expect(tutor.shouldPoll).toBe(true);
        tutor.lastPoll = moment();
        expect(tutor.shouldPoll).toBe(false);
    });
});
