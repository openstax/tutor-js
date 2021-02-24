import EmailNotification from '../../../src/components/notifications/email';

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

    it('displays verify message initially', () => {
        const notice = mount(<EmailNotification {...props} />);
        notice.find('.action').simulate('click');
        expect(props.notice.sendConfirmation).toHaveBeenCalled();
        notice.unmount();
    });

    it('displays verification input', function() {
        props.notice.verifyInProgress = true;
        const notice = mount(<EmailNotification {...props} />);
        notice.find('input').instance().value = '123456';
        notice.find('.action').simulate('click');
        expect(props.notice.sendVerification).toHaveBeenCalledWith('123456', expect.anything());
    });
});
