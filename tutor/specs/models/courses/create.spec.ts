import CourseCreate from '../../../src/models/course/create';
import { bootstrapCoursesList } from '../../courses-test-data';
import Offerings from '../../../src/models/course/offerings';

jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/course/offerings', () => ({
    get: jest.fn(() => undefined),
}));

describe('Course Builder UX Model', () => {
    let creator;

    beforeEach(() => {

        creator = new CourseCreate({
            name: 'TEST COURSE FOR TESTING',
            estimated_student_count: 100,
            offering_id: 1,
            term: { year: 2018, term: 'spring' },
        });

    });

    it('creates a course', () => {
        expect(creator.cloned_from_id).toBe(false);
        const saved = creator.save();
        expect(saved.url).toEqual('/courses');
        expect(saved.data).toMatchSnapshot();
    });

    it('validates ranges', () => {
        expect(creator.error).toBeNull();
        creator.setValue('estimated_student_count', 2000);
        expect(creator.error).toEqual({ attribute: 'students', direction: 'more', value: 1500 });
        creator.setValue('estimated_student_count', 20);
        expect(creator.error).toBeNull();
        creator.setValue('num_sections', 20);
        expect(creator.error).toEqual({ attribute: 'sections', direction: 'more', value: 10 });
    });

    describe('cloning a course', () => {
        const prepCourseClone = () => {
            const course = bootstrapCoursesList().get('2');
            creator.cloned_from = course;
            expect(creator.cloned_from_id).toBe(course.id);
            expect(creator.cloned_from).toBe(course);
            return { saved: creator.save(), course };
        };

        it('clones a course', () => {
            const mockOffering = { is_available: true };
            Offerings.get.mockImplementation(() => mockOffering);
            const { saved, course } = prepCourseClone();
            expect(creator.cloned_from_offering).toBe(mockOffering);
            expect(creator.name).toEqual(course.name);
            expect(saved.url).toEqual('/courses/2/clone');
            expect(saved.data).toMatchSnapshot();
        });

        it('does not clone if the course offering is no longer available', () => {
            expect(creator.term).not.toBeUndefined();
            const mockOffering = { name: 'My Test Course', is_available: false };
            Offerings.get.mockImplementation(() => mockOffering);
            const { course, saved } = prepCourseClone();
            expect(creator.cloned_from_offering).toBe(mockOffering);
            expect(creator.name).not.toEqual(course.name);
            expect(Offerings.get).toHaveBeenCalledWith(course.offering_id);
            expect(saved.url).toEqual('/courses');
            expect(saved.data.cloned_from_id).toBeUndefined();
        });
    });

});
