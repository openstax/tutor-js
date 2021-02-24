import React from 'react';
import SnapShot from 'react-test-renderer';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import Notifications from '../../../src/model/notifications';
import Bar from '../../../src/components/notifications/bar';

jest.mock('../../../src/model/notifications');
jest.useFakeTimers();

describe('Notifications Bar', function() {
    let props = null;

    beforeEach(() =>
        props = {
            displayAfter: 777,
            callbacks: {},
        });

    afterEach(function() {
        Notifications.getActive.mockClear();
        Notifications.on.mockClear();
        setTimeout.mockClear();
        Notifications.setCourseRole.mockClear();
    });

    it('renders and matches snapshot', function() {
        Notifications.getActive.mockReturnValue([{ id: '1', message: 'A test' }]);
        const wrapper = shallow(<Bar {...props} />);
        jest.runAllTimers();
        expect(wrapper.hasClass('viewable')).toEqual(true);
        expect(wrapper.find('SystemNotification[noticeId=\'1\']')).toHaveLength(1);

        const component = SnapShot.create(<Bar {...props} />);
        jest.runAllTimers();
        expect(component.toJSON()).toMatchSnapshot();
    });


    it('starts and stops listening to notifications', function() {
        const wrapper = shallow(<Bar {...props} />);
        expect(Notifications.on).toHaveBeenLastCalledWith('change', expect.anything());
        wrapper.unmount();
        expect(Notifications.off).toHaveBeenLastCalledWith('change', expect.anything());
    });

    it('shows itself after a delay if there are notifications', function() {
        Notifications.getActive.mockReturnValueOnce([{ id: '1', message: 'A test' }]);
        const wrapper = shallow(<Bar {...props} />);
        expect(wrapper.hasClass('viewable')).toEqual(false);
        expect(setTimeout.mock.calls.length).toBe(1);
        expect(setTimeout.mock.calls[0][1]).toBe(777);
        jest.runAllTimers();
        expect(wrapper.hasClass('viewable')).toEqual(true);
    });

    it('displays all notifications and can dismiss them', function() {
        const firstNotice = { id: '1', message: 'TEST 1' };
        Notifications.getActive.mockReturnValue([firstNotice]);
        const wrapper = shallow(<Bar {...props} />);
        jest.runAllTimers();
        expect(wrapper.hasClass('viewable')).toEqual(true);
        const systemNotice = wrapper.find('SystemNotification[noticeId=\'1\']');
        expect(systemNotice).toHaveLength(1);
        const secondNotice = { id: '2', message: 'TEST 2' };
        Notifications.getActive.mockReturnValue([firstNotice, secondNotice]);

        Notifications.on.mock.calls[0][1]();

        expect(wrapper.find('SystemNotification[noticeId=\'1\']')).toHaveLength(1);
        expect(wrapper.find('SystemNotification[noticeId=\'2\']')).toHaveLength(1);

        Notifications.getActive.mockReturnValue([secondNotice]);
        systemNotice.prop('onDismiss')();
        jest.runAllTimers();
        expect(Notifications.acknowledge).toHaveBeenLastCalledWith(firstNotice);

        expect(wrapper.find('SystemNotification[noticeId=\'1\']')).toHaveLength(0);
        expect(wrapper.find('SystemNotification[noticeId=\'2\']')).toHaveLength(1);

        // simulate no new notices
        Notifications.getActive.mockReturnValue(null);
        wrapper.find('SystemNotification[noticeId=\'2\']').prop('onDismiss')();
        jest.runAllTimers();
        expect(Notifications.acknowledge).toHaveBeenLastCalledWith(secondNotice);

        expect(wrapper.hasClass('viewable')).toEqual(false);
    });

    it('displays when new notices arrive', function() {
        Notifications.getActive.mockReturnValue(null);
        const wrapper = shallow(<Bar {...props} />);
        expect(wrapper.find('SystemNotification')).toHaveLength(0);
        expect(wrapper.hasClass('viewable')).toEqual(false);
        Notifications.getActive.mockReturnValue([{ id: '42', message: 'Foo' }]);
        Notifications.on.mock.calls[0][1]();
        expect(wrapper.hasClass('viewable')).toEqual(true);
        expect(wrapper.find('SystemNotification[noticeId=\'42\']')).toHaveLength(1);
    });


    it('notifies the store when course or role changes', function() {
        expect(Notifications.setCourseRole).not.toHaveBeenCalled();
        props.course = { id: '1', ends_at: moment().add(1, 'day'), students: [{ role_id: '111' }] };
        props.role = { id: '111', type: 'student', joined_at: '2016-01-30T01:15:43.807Z' };
        const wrapper = shallow(<Bar {...props} />);
        expect(Notifications.setCourseRole).toHaveBeenCalledTimes(1);

        wrapper.setProps(cloneDeep(props));
        expect(Notifications.setCourseRole).toHaveBeenCalledTimes(1);

        props = cloneDeep(props);
        props.role.id = '34';
        wrapper.setProps(props);
        expect(Notifications.setCourseRole).toHaveBeenCalledTimes(2);

        props = cloneDeep(props);
        props.course.id = '42';
        wrapper.setProps(props);
        expect(Notifications.setCourseRole).toHaveBeenCalledTimes(3);
    });
});
