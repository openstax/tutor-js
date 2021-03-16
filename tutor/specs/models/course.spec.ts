import UiSettings from 'shared/model/ui-settings';
import { map, cloneDeep, shuffle } from 'lodash';
import Courses from '../../src/models/courses-map';
import Course from '../../src/models/course';
import Payments from '../../src/models/payments';
import PH from '../../src/helpers/period';
import { autorun } from 'mobx';
import { bootstrapCoursesList } from '../courses-test-data';

import COURSE from '../../api/courses/1.json';
jest.mock('../../src/models/payments');
jest.mock('../../src/models/feature_flags', () => ({
    tours: true,
}));
jest.mock('shared/model/ui-settings', () => ({
    set: jest.fn(),
    get: jest.fn(),
}));

describe('Course Model', () => {

    beforeEach(() => bootstrapCoursesList());

    fit('can be bootstrapped and size observed', () => {
        Courses.clear();
        const lenSpy = jest.fn();
        autorun(() => lenSpy(Courses.size));
        expect(lenSpy).toHaveBeenCalledWith(0);
        bootstrapCoursesList();
        expect(lenSpy).toHaveBeenCalledWith(3);
        expect(Courses.size).toEqual(3);
    });

    it('#userStudentRecord', () => {
        expect(Courses.get(1).userStudentRecord).not.toBeNull();
        expect(Courses.get(1).userStudentRecord.student_identifier).toEqual('1234');
        expect(Courses.get(2).userStudentRecord).toBeNull();
    });

    it('#currentRole', () => {
        const c = Courses.get(1);
        expect(c.currentRole).toBe(c.primaryRole);
        const newRoleAttrs = { id: 92, type: 'unknown' };
        c.roles.push(newRoleAttrs);
        c.current_role_id = newRoleAttrs.id;
        expect(c.currentRole.id).toEqual(newRoleAttrs.id);
    });

    it('calculates audience tags', () => {
        expect(Courses.get(1).tourAudienceTags).toEqual(['student']);
        const teacher = Courses.get(2);
        teacher.just_created = true;
        expect(teacher.tourAudienceTags).toEqual(['teacher', 'teacher-with-previous-courses']);
        UiSettings.get = jest.fn(() => 2);
        teacher.just_created = false;
        expect(teacher.tourAudienceTags).toEqual(['teacher']);
        teacher.is_preview = true;
        expect(teacher.tourAudienceTags).toEqual(['teacher-preview']);
        const course = Courses.get(3);
        expect(course.tourAudienceTags).toEqual(['teacher']);
        course.roles.student.become();
        expect(course.tourAudienceTags).toEqual(['student']);
        course.roles.teacher.become();
        course.is_preview = false;
        expect(course.currentRole.isTeacher).toEqual(true);
        course.teacherTaskPlans.set('1', { id: 1, type: 'reading', is_publishing: true, isPublishing: true });
        expect(course.teacherTaskPlans.reading.hasPublishing).toEqual(true);
        expect(course.tourAudienceTags).toEqual(['teacher', 'teacher-reading-published']);
    });


    it('should return expected roles for courses', function() {
        expect(Courses.get(1).primaryRole.type).toEqual('student');
        expect(Courses.get(2).primaryRole.type).toEqual('teacher');
        expect(Courses.get(3).primaryRole.type).toEqual('teacher');
        expect(Courses.get(1).primaryRole.joinedAgo('days')).toEqual(7);
    });

    it('restricts joining to links', () => {
        const course = Courses.get(2);
        expect(course.is_lms_enabling_allowed).toEqual(false);
        expect(course.canOnlyUseEnrollmentLinks).toEqual(true);
        course.is_lms_enabling_allowed = true;
        expect(course.canOnlyUseEnrollmentLinks).toEqual(false);
        course.is_lms_enabled = true;
        course.is_access_switchable = false;
        expect(course.canOnlyUseEnrollmentLinks).toEqual(false);
        expect(course.canOnlyUseLMS).toEqual(true);
        course.is_lms_enabled = false;
        expect(course.canOnlyUseEnrollmentLinks).toEqual(true);
        expect(course.canOnlyUseLMS).toEqual(false);
    });

    describe('extending periods', () => {
        it('extends when given initial data', () => {
            const data = cloneDeep(COURSE);
            data.periods = shuffle(data.periods);
            jest.spyOn(PH, 'sort');

            const course = new Course(data);
            const len = course.periods.length;

            expect(map(course.periods, 'id')).not.toEqual(
                map(course.periods.sorted, 'id')
            );
            expect(PH.sort).toHaveBeenCalledTimes(1);

            const sortedSpy = jest.fn(() => course.periods.sorted);
            autorun(sortedSpy);

            expect(course.periods.sorted).toHaveLength(len - 2);
            expect(sortedSpy).toHaveBeenCalledTimes(1);
            expect(PH.sort).toHaveBeenCalledTimes(2);

            course.periods.remove(course.periods.find(p => p.id == 1));
            expect(course.periods.length).toEqual(len - 1);
            expect(course.periods.sorted.length).toEqual(len - 3);

            expect(PH.sort).toHaveBeenCalledTimes(3);
            expect(sortedSpy).toHaveBeenCalledTimes(2);
            expect(map(course.periods, 'id')).not.toEqual(
                map(course.periods.sorted, 'id')
            );
            expect(PH.sort).toHaveBeenCalledTimes(3);
            expect(sortedSpy).toHaveBeenCalledTimes(2);
        });

        it('extends new course', () => {
            const course = new Course();
            expect(course.periods).toHaveLength(0);
            expect(course.periods.sorted).toHaveLength(0);
            expect(course.periods.active).toHaveLength(0);
            course.update({
                name: 'My Grand Course',
                periods:
                    [{ name: 'Period #1', enrollment_code: '1234' },
                    { name: 'Period #2', enrollment_code: '4321' }]
            });
            expect(course.periods).toHaveLength(2);
            expect(course.periods.sorted).toHaveLength(2);
            expect(course.periods.active).toHaveLength(2);
        });
    });

    it('calculates if terms are before', () => {
        const course = Courses.get(2);
        expect(course.isBeforeTerm('spring', 2013)).toBe(false);
        expect(course.isBeforeTerm('spring', (new Date()).getFullYear() + 1)).toBe(true);
        expect(course.isBeforeTerm(course.term, course.year)).toBe(false);
    });

    it('returns bounds', () => {
        const course = Courses.get(1);
        expect(
            course.bounds.start.isSame(course.starts_at, 'day'),
        ).toBe(true);
        expect(
            course.bounds.end.isSame(course.ends_at, 'day'),
        ).toBe(true);
    });

    it('calculates payments needed', () => {
        const course = Courses.get(1);
        expect(course.needsPayment).toBe(false);
        course.does_cost = true;
        expect(course.needsPayment).toBe(false);
        Payments.config.is_enabled = true;
        expect(course.needsPayment).toBe(true);
    });
    it('returns savable attrs', () => {
        const course = Courses.get(1);
        expect(course.save()).toMatchObject({
            id: course.id,
            data: {
                name: course.name,
            },
        });
    });
});
