import { R, Factory, TutorRouter, hydrateModel, runInAction } from '../helpers';
import Enroll from '../../src/components/enroll';
import { CourseEnrollment } from '../../src/helpers/course-enrollment'
import { ApiError } from 'shared/model'


jest.mock('../../src/helpers/router');
jest.mock('../../src/models/user', () => ({
    currentUser: {
        terms: { fetch: jest.fn() },
        //        api: { errors: { withCode: jest.fn() } },
    },
}));

describe('Student Enrollment', () => {
    let params;
    let enrollment;
    let coursesMap;
    let fetchMock;
    let course;

    beforeEach(() => {
        coursesMap = Factory.coursesMap();
        fetchMock = Promise.resolve();
        coursesMap.fetch = jest.fn(() => fetchMock);
        course = coursesMap.array[0];
        coursesMap.set(course.id, course);
        params = { courseId: course.id };
        enrollment = hydrateModel(CourseEnrollment, {
            history: { push: jest.fn() },
            courses: coursesMap, enrollment_code: '1234',
        });
        enrollment.create = jest.fn();
        TutorRouter.currentParams.mockReturnValue(params);
        TutorRouter.makePathname = jest.fn((name) => name);
    });

    it('loads when mounted', async () => {
        enrollment.isLoadingCourses = true;
        const wrapper = mount(<R><Enroll enrollment={enrollment} /></R>);
        expect(enrollment.create).toHaveBeenCalled();
        expect(wrapper).toHaveRendered('StaxlyAnimation');
        expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
    });


    it('blocks teacher enrollment', async () => {
        enrollment.api.errors.set('courseEnroll', ApiError.fromMessage('courseEnroll', 'a error', {
            code: 'is_teacher',
            message: 'no!',
        }))

        expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();

        const enroll = mount(<R><Enroll enrollment={enrollment} /></R>);

        TutorRouter.makePathname = jest.fn(() => '/courses');
        enroll.find('Button').simulate('click');
        expect(TutorRouter.makePathname).toHaveBeenCalledWith('myCourses');
        expect(enrollment.history.push).toHaveBeenCalledWith('/courses');
        enroll.unmount()
    });

    it('forwards to your course if already a member', (done) => {
        enrollment.api.errors.set('courseEnroll', ApiError.fromMessage('courseEnroll', 'a error', {
            code: 'already_enrolled', message: 'no!',
            data: { course_name: 'My Course' },
        }))
        const enroll = mount(<R><Enroll enrollment={enrollment} /></R>);
        expect(enroll).toHaveRendered('StaxlyAnimation');
        enrollment.isComplete = true;
        enroll.update();
        setTimeout(() => {
            expect(enroll).toHaveRendered('Redirect');
            enroll.unmount();
            done();
        }, 100);
    });

    it('displays an invalid message', () => {
        enrollment.api.errors.set('courseEnroll', ApiError.fromMessage('courseEnroll', 'a error', {
            code: 'invalid_enrollment_code', message: 'no!',
        }))
        expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
    });

    it('displays generic error message', () => {
        enrollment.api.errors.set('courseEnroll', ApiError.fromMessage('courseEnroll', 'a error'))
        expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot()
    });

    describe('select periods', () => {
        beforeEach(() => {
            runInAction(() =>
                enrollment.enrollment_code = enrollment.originalEnrollmentCode = 'cc3c6ff9-83d8-4375-94be-8c7ae3024938'
            );
            enrollment.onEnrollmentCreate({
                data: {
                    name: 'My Grand Course',

                    periods: [
                        { name: 'Period #1', enrollment_code: '1234' },
                        {
                            name: 'Period #2',
                            enrollment_code: '4321',
                        },
                    ],
                },
            });
        });

        it('matches snapshot', () => {
            expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
        });

        it('can display a list of periods when joining from enrollment launch uuid', () => {
            enrollment.onEnrollmentCreate({
                is_lms_enabled: true,
                name: 'My Grand Course', periods: [
                    { name: '1st period', enrollment_code: '4321' },
                    { name: '2nd period', enrollment_code: '1234' },
                ],
            });
            const enroll = mount(<R><Enroll enrollment={enrollment} /></R>);
            expect(enroll).toHaveRendered('.enroll-form.periods');
            enroll.find('.choice').last().simulate('click');
            enroll.find('.btn-primary').simulate('click');
            expect(enrollment.pendingEnrollmentCode).toEqual('1234');

        });

        it('skips period selection when course has only one', () => {
            enrollment.originalEnrollmentCode = '1234'
            enrollment.create = jest.fn();
            enrollment.onEnrollmentCreate({
                name: 'My Grand Course', periods: [{
                    name: 'single period', enrollment_code: '4321',
                }],
            });
            const enroll = mount(<R><Enroll enrollment={enrollment} /></R>);
            expect(enroll).toHaveRendered('StudentIDForm');
            enroll.unmount()
        });
    });

    it('submits with student id when form is clicked', () => {
        const enroll = mount(<R><Enroll enrollment={enrollment}  /></R>);
        expect(enroll).toHaveRendered('StudentIDForm');
        expect.snapshot(<R><Enroll enrollment={enrollment} /></R>).toMatchSnapshot();
        enroll.find('input').simulate('change', { target: { value: '411' } });
        expect(enrollment.student_identifier).toEqual('411');
        enrollment.confirm = jest.fn();
        enroll.find('.btn-primary').simulate('click');
        expect(enrollment.confirm).toHaveBeenCalled();
    });

    it('redirects on success', () => {
        enrollment.to = { course: { id: '133' } };
        enrollment.isComplete = true;
        const enroll = mount(<R><Enroll enrollment={enrollment}  /></R>);
        expect(enroll).toHaveRendered('Redirect');
    });

});
