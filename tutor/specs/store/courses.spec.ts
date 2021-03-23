import { useLatestCoursePreview } from '../../src/store/courses'
import { TimeMock } from '../helpers';
import { map } from 'lodash'


let mockedCourses:any = {}
let mockedIds: number[] = []

jest.mock('react-redux', () => ({
    useSelector: jest.fn((cb) => cb({ courses: { ids: mockedIds, entities: mockedCourses } })),
}));

describe('CoursesStore', () => {
    TimeMock.setTo('2020-01-15T12:00:00.000Z');


    beforeEach( () => {
    })

    afterEach(() => {
        mockedIds = []// .splice(0, mockedIds.length)
        mockedCourses = {} // .(0, mockedCourses.length)
    });

    describe('useLatestCoursePreview', () => {
        it('should return latest non-expired preview', () => {
            mockedCourses = {
                1: { id: 1, offering_id: 2, is_preview: true, ends_at: '2020-01-01T00:00:00.000Z' },
                2: { id: 2, offering_id: 1, is_preview: true, ends_at: '2021-01-01T00:00:00.000Z' },
                3: { id: 3, offering_id: 1, is_preview: true, ends_at: '2018-01-01T00:00:00.000Z' },
                4: { id: 4, offering_id: 1, is_preview: false, ends_at: '2022-01-01T00:00:00.000Z' },
            }
            mockedIds.push(...map(mockedCourses, 'id'))
            expect(useLatestCoursePreview(1)?.id).toEqual(2)
        });

        it('returns undefined if all previews are expired', () => {
            mockedCourses = {
                1: { id: 1, offering_id: 1, is_preview: true, ends_at: '2015-01-01T00:00:00.000Z' },
                2: { id: 2, offering_id: 1, is_preview: true, ends_at: '2017-01-01T00:00:00.000Z' },
            }
            mockedIds.push(...map(mockedCourses, 'id'))
            expect(useLatestCoursePreview(1)).toBeUndefined()
        })
    })
});
