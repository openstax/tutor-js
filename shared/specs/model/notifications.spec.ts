import moment from 'moment';
import URLs from 'shared/model/urls';
import Notifications from 'shared/model/notifications';
import Poller from 'shared/model/notifications/pollers';
import FakeWindow from '../helpers/fake-window';

describe('Notifications', function() {
    let poll:any
    let setUrl:any;
    let windowImpl = new FakeWindow;

    beforeEach(function() {
        windowImpl = new FakeWindow;
        poll = jest.spyOn(Poller.prototype, 'poll');
        setUrl = jest.spyOn(Poller.prototype, 'setUrl');
    });

    afterEach(function() {
        poll.mockRestore();
        setUrl.mockRestore();
        Notifications._reset();
        URLs.reset();
    });

    it('polls when URL is set', function() {
        URLs.update({ accounts_api_url: 'http://localhost:2999/api' });
        Notifications.startPolling(windowImpl as any);
        expect(Poller.prototype.poll).toHaveBeenCalledTimes(1);
        expect((Poller.prototype.setUrl as any).mock.calls[0]).toEqual(['http://localhost:2999/api/user']);
        URLs.update({ tutor_api_url: 'http://localhost:3001/api' });
        Notifications.startPolling(windowImpl as any);
        expect(Poller.prototype.poll).toHaveBeenCalledTimes(2);
    });


    it('can display and confirm manual notifications', function() {
        const changeListener = jest.fn();
        const notice = { message: 'hello world', icon: 'globe' };
        Notifications.on('change', changeListener);
        Notifications.display(notice);
        expect(changeListener).toHaveBeenCalled();

        const active = Notifications.getActive()[0];
        expect(active).toBeTruthy();
        // should have copied the object vs mutating it
        expect(active).not.toEqual(notice);
        expect(active.type).toBeTruthy();

        Notifications.acknowledge(active);
        expect(changeListener).toHaveBeenCalledTimes(2);
        expect(Notifications.getActive()).toEqual([]);
    });

    it('clears old notices when course role is set', function() {
        Notifications.setCourseRole(
            { id: '1', students: [{ role_id: '111' }], ends_at: '2011-11-11T01:15:43.807Z' },
            { id: '111' }
        );
        expect(Notifications.getActive()).toHaveLength(1);
        expect(Notifications.getActive()[0].type).toEqual('course_has_ended');
        Notifications.setCourseRole(
            { id: '1', students: [{ role_id: '111' }], ends_at: moment().add('1 month').toISOString() },
            { id: '111' }
        );
        expect(Notifications.getActive()).toHaveLength(0);
    });


    it('adds course has ended when course role is set', function() {
        const changeListener = jest.fn();
        Notifications.once('change', changeListener);
        const course = { id: '1', students: [{ role_id: '111' }], ends_at: '2011-11-11T01:15:43.807Z' };
        Notifications.setCourseRole(course, { id: '111' });
        expect(changeListener).toHaveBeenCalled();
        const active = Notifications.getActive()[0];
        expect(active.type).toEqual('course_has_ended');
    });

    it('prevents duplicates from being displayed', function() {
        const notice = { id: '1', type: 'status' };
        Notifications.display(notice);
        Notifications.display(notice);
        expect(Notifications.getActive()).toEqual([notice]);
    });
});
