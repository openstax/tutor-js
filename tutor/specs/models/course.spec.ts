import UiSettings from 'shared/model/ui-settings';
import { map, cloneDeep, shuffle } from 'lodash';
import PH from '../../src/helpers/period';
import { autorun, runInAction } from 'mobx';
import { bootstrapCoursesList } from '../courses-test-data';
import { hydrateInstance, fetchMock } from '../helpers'
import COURSE from '../../api/courses/1.json';
import { hydrateModel } from 'modeled-mobx';
import { currentCourses, Course, FeatureFlags, CoursesMap } from '../../src/models'


jest.mock('../../src/models/feature_flags',() => ({
    FeatureFlags: {
        tours: true,
        is_payments_enabled: false,
    },
}));
jest.mock('shared/model/ui-settings', () => ({
    set: jest.fn(),
    get: jest.fn(),
}));

describe('Course Model', () => {

    beforeEach(() => bootstrapCoursesList());

    it('#userStudentRecord', () => {
        expect(currentCourses.get(1)?.userStudentRecord).not.toBeNull();
        expect(currentCourses.get(1)?.userStudentRecord?.student_identifier).toEqual('1234');
        expect(currentCourses.get(2)?.userStudentRecord).toBeNull();
    });

    it('#currentRole', () => {
        const c = currentCourses.get(1)!;
        expect(c.currentRole).toBe(c.primaryRole);
        const newRoleAttrs = { id: 92, type: 'unknown' };
        c.roles.push(newRoleAttrs as any);
        c.current_role_id = newRoleAttrs.id;
        expect(c.currentRole.id).toEqual(newRoleAttrs.id);
    });

    it('calculates audience tags', () => {
        expect(currentCourses.get(1)!.tourAudienceTags).toEqual(['student']);
        const teacher = currentCourses.get(2)!;
        teacher.just_created = true;
        expect(teacher.tourAudienceTags).toEqual(['teacher', 'teacher-with-previous-courses']);
        UiSettings.get = jest.fn(() => 2)!;
        teacher.just_created = false;
        expect(teacher.tourAudienceTags).toEqual(['teacher']);
        teacher.is_preview = true;
        expect(teacher.tourAudienceTags).toEqual(['teacher-preview']);
        const course = currentCourses.get(3)!;
        expect(course.tourAudienceTags).toEqual(['teacher']);
        course.roles.student!.become();
        expect(course.tourAudienceTags).toEqual(['student']);
        course.roles.teacher!.become();
        course.is_preview = false;
        expect(course.currentRole.isTeacher).toEqual(true);
        course.teacherTaskPlans.set('1', { id: 1, type: 'reading', is_publishing: true } as any);
        expect(course.teacherTaskPlans.reading.hasPublishing).toEqual(true);
        expect(course.tourAudienceTags).toEqual(['teacher', 'teacher-reading-published' ]);
    });


    it('should return expected roles for courses', function() {
        expect(currentCourses.get(1)?.primaryRole.type).toEqual('student');
        expect(currentCourses.get(2)?.primaryRole.type).toEqual('teacher');
        expect(currentCourses.get(3)?.primaryRole.type).toEqual('teacher');
        expect(currentCourses.get(1)?.primaryRole.joinedAgo('days')).toEqual(7);
    });

    it('restricts joining to links', () => {
        const course = currentCourses.get(2)!
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
            const spy = jest.spyOn(PH, 'sort');

            const course = hydrateModel(Course, data);
            const len = course.periods.length;

            expect(map(course.periods, 'id')).not.toEqual(
                map(course.periods.sorted, 'id')
            );
            expect(PH.sort).toHaveBeenCalledTimes(1);

            const sortedSpy = jest.fn(() => course.periods.sorted);
            autorun(sortedSpy);

            expect(course.periods.sorted).toHaveLength(len);
            expect(sortedSpy).toHaveBeenCalledTimes(1);
            expect(PH.sort).toHaveBeenCalledTimes(3);

            runInAction(() => course.periods.remove(course.periods.find(p => p.id == 1)!) )
            expect(course.periods.length).toEqual(len - 1);
            expect(course.periods.sorted.length).toEqual(len - 1);

            spy.mockRestore();
        });

        it('extends new course', () => {
            const course = new Course();
            expect(course.periods).toHaveLength(0);
            expect(course.periods.sorted).toHaveLength(0);
            expect(course.periods.active).toHaveLength(0);
            runInAction( () => {
                hydrateInstance(course, {
                    name: 'My Grand Course',
                    periods: [
                        { name: 'Period #1', enrollment_code: '1234' },
                        { name: 'Period #2', enrollment_code: '4321' },
                    ],
                });
            })
            expect(course.periods).toHaveLength(2);
            expect(course.periods.sorted).toHaveLength(2);
            expect(course.periods.active).toHaveLength(2);
        });
    });

    it('gets latest course for offering', () => {
        const courses = new CoursesMap()
        courses.set(1, { id: 1, ends_at: '2020-01-01', offering_id: 1 } as any)
        courses.set(2, { id: 2, ends_at: '2018-01-01', offering_id: 2 } as any)
        courses.set(3, { id: 3, ends_at: '2019-01-01', offering_id: 2 } as any)
        expect(courses.latestForOffering({ id: 2 } as any)?.id).toBe(3)
    })

    it('calculates if terms are before', () => {
        const course = currentCourses.get(2)!;
        expect(course.isBeforeTerm('spring', 2013)).toBe(false);
        expect(course.isBeforeTerm('spring', (new Date()).getFullYear()+1)).toBe(true);
        expect(course.isBeforeTerm(course.term, course.year)).toBe(false);
    });

    it('returns bounds', () => {
        const course = currentCourses.get(1)!;
        expect(
            course.bounds.start.isSame(course.dateTimeInZone(course.starts_at), 'day'),
        ).toBe(true);
        expect(
            course.bounds.end.isSame(course.dateTimeInZone(course.ends_at), 'day'),
        ).toBe(true);
    });

    it('calculates payments needed', () => {
        const course = currentCourses.get(1)!;
        expect(course.needsPayment).toBe(false);
        course.does_cost = true;
        expect(course.needsPayment).toBe(false);
        FeatureFlags.is_payments_enabled = true
        expect(course.needsPayment).toBe(true);
    })

    it('can be saved', async () => {
        const course = currentCourses.get(1)!;
        fetchMock.mockResponseOnce(JSON.stringify({ id: 1234 }))
        await course.save()
        expect(fetchMock.mock.calls.length).toEqual(1)
        expect(fetchMock.mock.calls[0][0]).toContain('api/courses/1')
        const body = fetchMock.mock.calls[0][1]?.body as string
        expect(JSON.parse(body)).toMatchObject({
            name: course.name,
            is_lms_enabled: false,
        })
    });
});
