import React from 'react';

import ConfirmJoinCourse from '../../../src/components/enroll/confirm-join-course';

const COURSE_ENROLLMENT_STORE_WITH_CONFLICT = {
    isBusy: false,
    hasConflict() { return true; },
    description() { return 'New CC course'; },
    teacherNames() { return 'New course instructors'; },
    conflictDescription() { return 'Previous CC course'; },
    conflictTeacherNames() { return 'Previous course instructors'; },
    getEnrollmentChangeId() { return 42; },
    getStudentIdentifier() { return 'S000042'; },
    errorMessages() { return []; },
};

const COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT = {
    isBusy: false,
    hasConflict() { return false; },
    description() { return 'New Tutor course'; },
    teacherNames() { return 'New course instructors'; },
    getEnrollmentChangeId() { return 42; },
    getStudentIdentifier() { return 'S000042'; },
    errorMessages() { return []; },
};

describe('ConfirmJoinCourse Component', () => {
    let courseEnrollmentActions = null;

    beforeEach(() => courseEnrollmentActions = { confirm: jest.fn() });

    describe('with conflict', function() {

        it('displays info about the conflicting CC course', function() {
            const wrapper = mount(<ConfirmJoinCourse
                courseEnrollmentActions={courseEnrollmentActions}
                courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT} />);
            expect(wrapper.find('.conflicts li').text()).toContain(
                'We will remove you from Previous CC course'
            );
        });

        it('displays info about the CC course being joined', function() {
            const wrapper = shallow(
                <ConfirmJoinCourse
                    courseEnrollmentActions={courseEnrollmentActions}
                    courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT} />
            );
            expect(wrapper.find('.title .join').text()).toEqual('You are joining');
            expect(wrapper.find('.title .course').text()).toEqual('New CC course');
            expect(wrapper.find('.title .teacher').text()).toEqual('New course instructors');
        });

        it('calls confirm() on the courseEnrollmentActions object when the button is clicked', function() {
            const wrapper = mount(
                <ConfirmJoinCourse
                    courseEnrollmentActions={courseEnrollmentActions}
                    courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT} />
            );
            wrapper.find('button.btn.continue').simulate('click');
            expect(courseEnrollmentActions.confirm).toHaveBeenCalled();
        });

        xit('calls confirm() on the courseEnrollmentActions object when enter is pressed', function() {
            const wrapper = mount(
                <ConfirmJoinCourse
                    courseEnrollmentActions={courseEnrollmentActions}
                    courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT} />
            );

            // These do not work... Enzyme bug? https://github.com/airbnb/enzyme/issues/441
            // http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
            wrapper.simulate('keyPress', { key: 'Enter' });
            wrapper.find('button.btn.continue').simulate('keyPress', { key: 'Enter' });
            expect(courseEnrollmentActions.confirm.called).toBe(true);
        });
    });

    describe('without conflict', function() {

        it('does not display conflicting CC course info', function() {
            const wrapper = mount(
                <ConfirmJoinCourse
                    courseEnrollmentActions={courseEnrollmentActions}
                    courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT} />
            );
            expect(wrapper.find('.conflicts li').length).toEqual(0);
        });

        it('displays info about the course being joined', function() {
            const wrapper = shallow(
                <ConfirmJoinCourse
                    courseEnrollmentActions={courseEnrollmentActions}
                    courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT} />
            );
            expect(wrapper.find('.title .join').text()).toEqual('You are joining');
            expect(wrapper.find('.title .course').text()).toEqual('New Tutor course');
            expect(wrapper.find('.title .teacher').text()).toEqual('New course instructors');
        });

        it('calls confirm() on the courseEnrollmentActions object when the button is clicked', function() {
            const wrapper = mount(
                <ConfirmJoinCourse
                    courseEnrollmentActions={courseEnrollmentActions}
                    courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT} />
            );
            wrapper.find('button.btn.continue').simulate('click');
            expect(courseEnrollmentActions.confirm).toHaveBeenCalled();
        });

        xit('calls confirm() on the courseEnrollmentActions object when enter is pressed', function() {
            const wrapper = mount(
                <ConfirmJoinCourse
                    courseEnrollmentActions={courseEnrollmentActions}
                    courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT} />
            );

            // These do not work... Enzyme bug? https://github.com/airbnb/enzyme/issues/441
            // http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
            wrapper.simulate('keyPress', { key: 'Enter' });
            wrapper.find('.btn.continue').simulate('keyPress', { key: 'Enter' });
            expect(courseEnrollmentActions.confirm.called).toBe(true);
        });
    });
});
