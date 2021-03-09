import { Factory, TestRouter } from '../../helpers';
import BuilderUX from '../../../src/screens/new-course/ux';
import User from '../../../src/models/user';
import Router from '../../../src/helpers/router';

jest.mock('../../../src/helpers/router');
jest.useFakeTimers();

jest.mock('../../../src/models/user', () => ({
    canCreateCourses: true,
}));

const testRouter = new TestRouter();
let courses;
const createTestUX = () => new BuilderUX({
    router: testRouter,
    courses,
    offerings: Factory.offeringsMap({ count: 2 }),
});

describe('Course Builder UX Model', () => {
    let ux;

    beforeEach(() => {
        User.canCreateCourses = true;
        courses = Factory.coursesMap({ is_teacher: true });
        ux = createTestUX();
        ux.courses.array[0].offering_id = ux.offerings.array[0].id;
    });


    function advanceToSave() {
        expect(ux.stage).toEqual('numbers');
        ux.newCourse.setValue('num_sections', 11);
        ux.newCourse.setValue('estimated_student_count', 110);
        expect(ux.newCourse.error).toMatchObject({ attribute: 'sections', value: 10 });
        expect(ux.canGoForward).toBe(false);
        ux.newCourse.setValue('num_sections', 9);
        expect(ux.newCourse.error).toBeNull();
        expect(ux.canGoForward).toBe(true);

        ux.newCourse.save = jest.fn(() => Promise.resolve());
        ux.goForward();
        expect(ux.stage).toEqual('build');
        expect(ux.canNavigate).toBe(false);
        expect(ux.newCourse.save).toHaveBeenCalled();
    }

    it('sets cloned course when sourceId is present', () => {
        const course = courses.array[0];
        testRouter.match.params = { sourceId: course.id };
        course.name = 'CLONE ME';
        ux = createTestUX();
        expect(ux.source).not.toBeUndefined();
        ux.offerings.set(course.offering_id, Factory.offering());

        expect(ux.newCourse.cloned_from_id).toEqual(course.id);
        expect(ux.newCourse.name).toEqual('CLONE ME');
    });

    it('can advance through steps for new course', () => {
        expect(ux.stage).toEqual('offering');
        expect(ux.canGoBackward).toBe(false);
        expect(ux.canGoForward).toBe(false);
        ux.newCourse.offering = ux.offerings.array[0];
        expect(ux.canGoForward).toBe(true);

        ux.goForward();
        expect(ux.canGoBackward).toBe(true);
        expect(ux.stage).toEqual('term');
        expect(ux.canGoForward).toBe(false);
        ux.newCourse.term = { year: 2018 };
        expect(ux.canGoForward).toBe(true);

        ux.goForward();
        expect(ux.stage).toEqual('new_or_copy');
        expect(ux.canGoForward).toBe(true);

        ux.goForward();
        expect(ux.stage).toEqual('name');
        expect(ux.newCourse.name).toEqual(ux.offering.title);

        ux.goBackward();
        expect(ux.stage).toEqual('new_or_copy');
        ux.newCourse.new_or_copy = 'copy';
        expect(ux.canGoForward).toBe(true);
        ux.goForward();

        const course = ux.courses.array[0];

        expect(ux.stage).toEqual('cloned_from_id');
        expect(ux.canGoForward).toBe(false);
        ux.source = course;

        expect(ux.canGoForward).toBe(true);
        ux.goForward();
        expect(ux.stage).toEqual('name');
        expect(ux.newCourse.name).toEqual(course.name);
        ux.goForward();
        expect(ux.newCourse.num_sections).toEqual(course.periods.length);
        advanceToSave();
    });

    it('can advance through steps for cloned course', () => {
        const course = ux.courses.array[0];
        testRouter.match.params = { sourceId: course.id };
        ux = createTestUX();
        expect(ux.stage).toEqual('term');
        expect(ux.canGoForward).toBe(false);
        ux.newCourse.term = { year: 2018 };
        expect(ux.canGoForward).toBe(true);
        ux.goForward();
        expect(ux.stage).toEqual('name'); // new_or_copy is skipped
        ux.newCourse.name = 'test';
        expect(ux.canGoForward).toBe(true);
        ux.goForward();
        advanceToSave();
    });

    it('goes to my courses after canceling', () => {
        ux.router = {
            route: { match: { params: {} } },
            history: { push: jest.fn() },
        };
        const { onCancel } = ux;
        onCancel();
        expect(ux.router.history.push).toHaveBeenCalledWith('/courses');
    });

    it('shows unavailable message for unavailable offerings', () => {
        const offering = ux.offerings.array[0];
        offering.is_available = false;
        ux.newCourse.offering_id = offering.id;
        expect(ux.stage).toEqual('offering_unavail');
    });

    it('can backup and change offering', () => {
        ux = createTestUX();
        expect(ux.stage).toEqual('offering');
        ux.newCourse.offering = ux.offerings.array[0];
        ux.goForward();
        expect(ux.stage).toEqual('term');
        ux.goBackward();
        expect(ux.stage).toEqual('offering');
        const offering = ux.offerings.array[0];
        ux.newCourse.offering_id = offering.id;
        ux.newCourse.offering = ux.offerings.array[1];
        expect(ux.offering).toEqual(ux.offerings.array[1]);
    });

    it('redirects to not allowed teacher page if teacher isnt allowed access', () => {
        User.canCreateCourses = false;
        ux = createTestUX();
        Router.makePathname.mockReturnValue('/only-teacher');
        jest.runOnlyPendingTimers();
        expect(ux.router.history.replace).toHaveBeenCalledWith('/only-teacher');
    });

    describe('after course is created', function() {
        beforeEach(() => {
            ux.router = {
                match: { params: {} },
                history: { push: jest.fn() },
            };
            ux.newCourseMock = { id: 42 };
            ux.newCourse.term = { year: 2018, term: 'spring' };
            ux.newCourse.save = jest.fn(() => ({
                then: (c) => {
                    ux.newCourse.onCreated({ data: ux.newCourseMock });
                    c();
                },
            }));
        });

    });

});
