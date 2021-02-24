import SystemNotifications from '../../../src/components/notifications/system';

describe('System Notifications', function() {
    let props = null;

    beforeEach(() =>
        props = {
            onDismiss: jest.fn(),

            notice: {
                id: '1',
                message: 'a test notice',
                type: 'tutor',
            },
        }
    );

    it('remembers notice as ignored when dismiss is clicked', () => {
        const notice = mount(<SystemNotifications {...props} />);
        notice.find('button.dismiss').simulate('click');
        expect(props.onDismiss).toHaveBeenCalled();
    });

    it('displays icon based on level', function() {
        props.notice.level = 'alert';
        const notices = mount(<SystemNotifications {...props} />);
        expect(notices).toHaveRendered('Icon[type="exclamation-triangle"]');
    });

    it('displays icon provided', function() {
        props.notice.icon = 'ghost';
        const notices = mount(<SystemNotifications {...props} />);
        expect(notices).toHaveRendered('Icon[type="ghost"]');
    });
});
