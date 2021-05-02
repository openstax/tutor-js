import { fetchMock, Factory, deferred, ApiMock } from '../../helpers'
import CourseEnroll from '../../../src/models/course/enroll';
import User from '../../../src/models/user';
import { runInAction } from 'mobx';
import { ApiError, NEW_ID } from 'shared/model';
import { mount } from 'enzyme'

jest.mock('../../../src/models/user', () => ({
    terms: { fetch: jest.fn() },
}));

describe('Course Enrollment', function() {
    let enroll: CourseEnroll
    let coursesMap: ReturnType<typeof Factory.coursesMap>

    beforeEach(() => {
        coursesMap = Factory.coursesMap();
        enroll = new CourseEnroll({ courses: coursesMap, user: User });
    });

    it('#isInvalid', () => {
        expect(enroll.isInvalid).toBe(false);
        enroll.api.errors.set('courseEnroll', ApiError.fromMessage('courseEnroll', 'a error', {
            code: 'invalid_enrollment_code',
            message: 'no!',
        }))
        expect(enroll.isInvalid).toBe(true)
    })

    it('#isPending', () => {
        expect(enroll.isPending).toBe(true)
        runInAction(() => enroll.api.errors.set('foo', ApiError.fromMessage('foo', 'a error')))
        expect(enroll.isPending).toBe(false)
        runInAction(() => enroll.api.errors.delete('foo'))
        enroll.to = { course: { name: 'test' } };
        expect(enroll.isPending).toBe(false);
    });


    fit('blocks teachers', async () => {
        fetchMock.mockResponseOnce(() => Promise.resolve({
            status: 422,
            body: JSON.stringify({ errors: [{
                code: 'is_teacher', message: 'You cannot enroll as both a student and a teacher',
                data: { course_name: 'Biology' },
            }] }),
        }));
        enroll.enrollment_code ='1234'
        await enroll.create()
        expect(enroll.isTeacher).toBeTruthy()
    })

    it('#courseName', () => {
        enroll.to = { course: { name: 'test course' } };
        expect(enroll.courseName).toEqual('test course');
        runInAction(() => {
            enroll.api.errors.set('courseEnroll', ApiError.fromMessage('courseEnroll', 'a error', {
                code: 'is_teacher', message: 'teach', data: { course_name: 'FROM API' },
            }))
        })
        expect(enroll.isTeacher).toBeTruthy()
        expect(enroll.courseName).toEqual('FROM API')
    })


    it('#onCancelStudentId', () => {
        enroll.confirm = jest.fn();
        enroll.onCancelStudentId();
        expect(enroll.student_identifier).toEqual('');
        expect(enroll.confirm).toHaveBeenCalled();
    });

    it('#isRegistered', () => {
        fetchMock.mockResponseOnce(JSON.stringify([Factory.bot.create('Course')]))
        expect(enroll.isRegistered).toBe(false);
        enroll.api.errors.set('courseEnroll', ApiError.fromMessage('courseEnroll', 'a error', {
            code: 'already_enrolled', message: 'bad bad',
        }))
        expect(enroll.isRegistered).toBe(true);
        enroll.api.errors.clear()
        expect(enroll.isRegistered).toBe(false);
        enroll.status = 'processed';
        expect(enroll.isRegistered).toBe(true);
    });

    it('fetches on complete', async () => {
        const course = Factory.bot.create('Course')
        enroll.enrollment_code = course.periods[0].enrollment_code = '1234';
        fetchMock.mockResponseOnce(JSON.stringify([course]))
        enroll.to = { period: { assignments_count: 42 } };
        runInAction(() => enroll.status = 'processed' )
        coursesMap.onLoaded([course] as any)
        expect(enroll.isRegistered).toBe(true);
        await deferred(() => {
            expect(enroll.isComplete).toBe(true);
            expect(User.terms.fetch).toHaveBeenCalled();
            expect(enroll.course).toBeTruthy()
            expect(enroll.course?.studentTaskPlans.expecting_assignments_count).toEqual(42);
        })
    });

    it('#confirm', async () => {
        const spy = jest.fn(() => Promise.resolve(JSON.stringify({ ok: true })))
        fetchMock.mockResponseOnce(spy)
        enroll.id = '821'
        enroll.student_identifier = '1234'
        await enroll.confirm()
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            url: expect.stringMatching('enrollment/821/approve'),
        }))
    });

    it('confirmation api flow', async () => {
        const course = Factory.bot.create('Course')
        enroll.enrollment_code = enroll.originalEnrollmentCode = 'e1e1a822-0985-4b54-b5ab-f0963d98c494';

        const spys = ApiMock.mock({
            'enrollment/e1e1a822-0985-4b54-b5ab-f0963d98c494/choices': course,
            'enrollment$': { id: 1234 },
            'courses': [ course ],
            'enrollment/1234/approve': { status: 'processed' },
        })

        expect(enroll.needsPeriodSelection).toBe(true);
        expect(enroll.courseToJoin).toBeNull()

        await enroll.create()
        expect(spys['enrollment/e1e1a822-0985-4b54-b5ab-f0963d98c494/choices']).toHaveBeenCalled()

        expect(enroll.courseToJoin).toBeDefined()
        expect(enroll.needsPeriodSelection).toBeTruthy()
        expect(enroll.courseToJoin?.id).toEqual(course.id)
        expect(enroll.id).toEqual(NEW_ID)

        enroll.enrollment_code = '1234'
        expect(enroll.needsPeriodSelection).toBe(false)

        await enroll.create()
        expect(spys['enrollment$']).toHaveBeenCalled()

        expect(enroll.id).toEqual(1234)

        enroll.student_identifier = 'student-id-1234';

        await enroll.confirm()
        expect(spys['enrollment/1234/approve']).toHaveBeenCalled()
        expect(spys['courses']).toHaveBeenCalled()
        expect(enroll.isRegistered).toBeTruthy()
    });

    it('blocks lms and links from the wrong way', () => {
        enroll.to = { course: { is_lms_enabled: true } };
        let comp = mount(enroll.bodyContents);
        expect(comp.text()).toContain('this enrollment link isn’t valid');

        enroll.to.is_lms_enabled = false;
        enroll.originalEnrollmentCode = 'e1e1a822-0985-4b54-b5ab-f0963d98c494';
        enroll.courseToJoin = Factory.course({ is_lms_enabled: false })
        expect(enroll.isFromLms).toBe(true);
        expect(enroll.courseIsLmsEnabled).toBe(false);
        comp = mount(enroll.bodyContents);
        expect(comp.text()).toContain('you need an enrollment link');
    });

});
