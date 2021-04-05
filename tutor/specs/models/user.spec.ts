import { autorun, action } from 'mobx';
import { TimeMock, fetchMock } from '../helpers';
import User from '../../src/models/user';
import { UserTerms } from '../../src/models/user/terms';
import Courses from '../../src/models/courses-map';
import UiSettings from 'shared/model/ui-settings';

import USER_DATA from '../../api/user.json';
import { bootstrapCoursesList } from '../courses-test-data';
import DateTime from 'shared/model/date-time'

describe('User Model', () => {
    beforeEach(() => fetchMock.resetMocks())
    afterEach(() => {
        User.viewed_tour_stats.clear();
    });


    TimeMock.setTo('2021-01-15T12:00:00.000Z');

    it('can be bootstrapped', () => {
        const spy = jest.fn();
        autorun(() => spy(User.name));
        expect(spy).toHaveBeenCalledWith('');
        User.bootstrap(USER_DATA);
        expect(spy).toHaveBeenCalledWith(USER_DATA.name);
        expect(User.terms).toBeInstanceOf(UserTerms);
    });

    it('calculates metrics tags', () => {
        bootstrapCoursesList();
        expect(User.metrics.is_new_user).toEqual(true)
        expect(User.metrics.course_subjects).toEqual('testing');
        expect(User.metrics.course_types).toEqual('real');
    })
  
    it('calculates audience tags', () => {
        bootstrapCoursesList();
        expect(User.tourAudienceTags).toEqual(['teacher', 'teacher-not-previewed']);
        const course = Courses.get(2)!;
        course.is_preview = true;
        UiSettings.set('DBVC', course.id, 1);

        expect(User.tourAudienceTags).toEqual(['teacher']);

        Courses.forEach((c) => { c.trackDashboardView(); });
        expect(User.tourAudienceTags).toEqual(['teacher']);

        Courses.forEach((c) => {
            c.appearance_code = 'intro_sociology';
        });
        expect(User.tourAudienceTags).toEqual(['teacher']);

        Courses.clear();
        expect(User.tourAudienceTags).toEqual([]);
    });

    it('#verifiedRoleForCourse', () => {
        bootstrapCoursesList();
        expect(User.verifiedRoleForCourse(Courses.get(1)!)).toEqual('student');
        User.can_create_courses = true;
        expect(User.verifiedRoleForCourse(Courses.get(2)!)).toEqual('student');
        User.faculty_status = 'confirmed_faculty';
        expect(User.verifiedRoleForCourse(Courses.get(2)!)).toEqual('teacher');
    });

    it('#recordSessionStart', () => {
        const spy = jest.spyOn(UiSettings, 'set');
        fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))
        User.recordSessionStart();
        expect(UiSettings.set).toHaveBeenCalled();
        expect(UiSettings.set).toHaveBeenCalledWith('sessionCount', 1);

        spy.mockReset();
        spy.mockRestore();
    });

    it('#isProbablyTeacher', action(() => {
        User.faculty_status = 'nope' as any;
        User.can_create_courses = false;
        User.self_reported_role = 'student';
        Courses.clear();
        expect(User.isProbablyTeacher).toBe(false);
        bootstrapCoursesList();
        expect(User.isProbablyTeacher).toBe(true);
        expect(User.canViewPreviewCourses).toBe(false);
        Courses.clear();
        User.can_create_courses = false;
        User.self_reported_role = 'instructor';
        expect(User.isProbablyTeacher).toBe(true);
        expect(User.canViewPreviewCourses).toBe(false);
        User.can_create_courses = true;
        expect(User.canViewPreviewCourses).toBe(true);
    }));

    it('#logEvent', action(() => {
        fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))
        const ev = { category: 'test', code: 'test', data: { some: 'data' } };
        User.can_create_courses = false;
        User.self_reported_role = 'student';
        User.logEvent(ev)

        expect(fetchMock.mock.calls).toHaveLength(0)
        User.self_reported_role = 'instructor';
        User.logEvent(ev)
        expect(fetchMock.mock.calls).toHaveLength(1)
        const body = fetchMock.mock.calls[0][1]?.body as string
        expect(JSON.parse(body)).toMatchObject({
            some: 'data',
        })
    }))

    it('checks for names then splits', action(() => {
        User.name = 'Sir Alex Williams IV';
        User.first_name = User.last_name = '';
        expect(User.initials).toEqual('S I');
        User.first_name = 'Bob';
        expect(User.firstName).toEqual('Bob');
        User.last_name = 'Smith';
        expect(User.lastName).toEqual('Smith');
        expect(User.initials).toEqual('B S');
    }))

    it('calculates new users', action(() => {
        // one hour ago
        User.created_at = new DateTime('2021-01-15T11:00:00.000Z')
        expect(User.wasNewlyCreated).toBe(true)
        // a day + hour ago
        User.created_at = new DateTime('202-0-0T14:11:00.000Z')
        expect(User.wasNewlyCreated).toBe(false)
    }))
});
