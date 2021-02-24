import React from 'react';
import SnapShot from 'react-test-renderer';

import CourseHasEnded from '../../../src/components/notifications/course-has-ended';

describe('Notifications MissingStudentId notice', function() {
    let props = null;
    beforeEach(() =>
        props = {
            callbacks: {
                onCCSecondSemester: jest.fn(),
            },

            notice: {
                role: {},

                course: {
                    id: '1',
                    ends_at: '2011-11-11T01:15:43.807Z',
                },
            },
        }
    );

    it('renders and matches snapshot', function() {
        const component = SnapShot.create(<CourseHasEnded {...props} />);
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('calls onCCSecondSemester callback', function() {
        const wrapper = shallow(<CourseHasEnded {...props} />);
        wrapper.find('a.action').simulate('click');
        expect(props.callbacks.onCCSecondSemester).toHaveBeenCalled();
    });
});
