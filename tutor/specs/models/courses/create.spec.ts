import { CourseCreate } from '../../../src/models'
import { hydrateInstance } from 'modeled-mobx';
import { ApiMock, Factory } from '../../helpers'
import { NEW_ID } from 'shared/model';

jest.mock('../../../src/helpers/router');

describe('Course Builder UX Model', () => {
    let creator: CourseCreate;
    let coursesMap: ReturnType<typeof Factory.coursesMap>
    let offeringsMap: ReturnType<typeof Factory.offeringsMap>

    const mocks = ApiMock.intercept({
        'course$': Factory.bot.create('Course'),
        'courses/\\d+/clone': Factory.bot.create('Course'),
    })

    beforeEach(() => {
        coursesMap = Factory.coursesMap()
        offeringsMap = Factory.offeringsMap()

        creator = new CourseCreate({
            offerings: offeringsMap,
            courses: coursesMap,
        })
        hydrateInstance(creator, {
            name: 'TEST COURSE FOR TESTING',
            estimated_student_count: 100,
            offering_id: 1,
            term: { year: 2018, term: 'spring' },
        });

    });

    it('creates a course', async () => {
        expect(creator.cloned_from_id).toBe(NEW_ID);
        await creator.save();
        expect(mocks['course$']).toHaveBeenCalled()
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
            const course = coursesMap.array[0]
            offeringsMap.set(course.offering_id, Factory.offering({ id: course.offering_id }))
            creator.cloned_from = course;
            expect(creator.cloned_from_id).toBe(course.id);
            expect(creator.cloned_from).toBe(course);
            return { creator, course };
        };

        it('clones a course', async () => {
            const { creator, course } = prepCourseClone();
            await creator.save()
            expect(creator.name).toEqual(course.name);
        });

        it('does not clone if the course offering is no longer available', () => {
            const { creator } = prepCourseClone();
            const offering = Factory.offering({ id: creator.offering_id, is_available: false })
            creator.offerings.set(offering.id, offering)
            expect(creator.offerings.get(creator.offering_id)).toBe(offering)
            expect(creator.offering).toBe(offering)
            expect(creator.term).not.toBeUndefined();
            expect(creator.canCloneCourse).toBeFalsy()
        });
    });

});
