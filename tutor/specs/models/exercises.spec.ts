import { ExercisesMap as Exercises } from '../../src/models/exercises';
import { sampleSize, keys, forEach } from 'lodash';
import { TutorExerciseObj } from '../../src/models/types';
import { fetchMock, Factory } from '../helpers'

describe('Exercises Map', () => {
    let book: ReturnType<typeof Factory.book>
    let course: ReturnType<typeof Factory.course>
    let exercises: Exercises
    let page_ids: number[] = []

    beforeEach(() => {
        book = Factory.book();
        course = Factory.course();
        exercises = new Exercises();
        page_ids = sampleSize(Array.from(book.pages.byId.keys()), 3);
    });

    it('collects important tag info', () => {
        const exercise = Factory.tutorExercise();
        expect(exercise.tags.important.lo?.id).toEqual('lo:stax-phys:1-2-1')
    });

    it('detects if none exist for page ids', () => {
        exercises = Factory.exercisesMap({ book, pageIds: page_ids });
        expect(exercises.noneForPageIds()).toBe(true);
        expect(exercises.noneForPageIds([page_ids[0]])).toBe(false);
        expect(exercises.noneForPageIds([(null as any as number), 12345, page_ids[0]])).toBe(false);
        expect(exercises.noneForPageIds([123, 456])).toBe(true);
    });

    it('filters', () => {
        exercises = Factory.exercisesMap({ book, pageIds: page_ids });
        const ex = exercises.array[0];

        ex.pool_types = ['reading_dynamic'];
        expect(exercises.reading.array).toContain(ex);
        expect(exercises.homework.array).not.toContain(ex);

        ex.pool_types = ['homework_core'];
        expect(exercises.homework.array).toContain(ex);
        expect(exercises.reading.array).not.toContain(ex);
    });

    it('includes course id when course is provided to load', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([
            Factory.bot.create('TutorExercise'), Factory.bot.create('TutorExercise'),
        ]))
        await exercises.fetch({ course, book, page_ids, limit: 'homework_core' })
        expect(fetchMock.mock.calls).toHaveLength(1)
        expect(fetchMock.mock.calls[0][0]).toContain(`course_id=${course.id}`)
    });

    it('can be loaded and group by page', async () => {
        page_ids.forEach(page_id => { expect(exercises.isFetching({ page_id })).toBe(false); });
        expect(fetchMock.mock.calls).toHaveLength(0)
        fetchMock.mockResponseOnce(JSON.stringify([
            Factory.bot.create('TutorExercise'), Factory.bot.create('TutorExercise'),
        ]))

        exercises.fetch({ book, page_ids })
        expect(fetchMock.mock.calls).toHaveLength(1)
        expect(fetchMock.mock.calls[0][0]).toContain(`ecosystems/${book.id}/exercises/homework_core`)

        page_ids.forEach(page_id => { expect(exercises.isFetching({ page_id })).toBe(true); });

        const items = page_ids.map(page_id =>
            Factory.bot.create('TutorExercise', { page_uuid: book.pages.byId.get(page_id).uuid }) as TutorExerciseObj,
        )

        exercises.onLoaded(items, undefined, book, page_ids);

        page_ids.forEach(page_id => { expect(exercises.isFetching({ page_id })).toBe(false); });
        page_ids.forEach(page_id => { expect(exercises.hasFetched({ page_id })).toBe(true); });

        expect(keys(exercises.byPageId).sort()).toEqual( page_ids.sort() );
        forEach(exercises.byPageId, (exs, pageId) => {
            expect(exs).toHaveLength(1);
            expect(exs[0].page.id).toEqual(pageId);
        });

    });

    it('can check if any page is loading', async () => {
        fetchMock.mockResponseOnce(() => new Promise((done) => {
            setTimeout(() => done(JSON.stringify([
                Factory.bot.create('TutorExercise'), Factory.bot.create('TutorExercise'),
            ])), 10)
        }))
        const fetchPromise = exercises.fetch({ book, page_ids })
        expect(exercises.isFetching({ page_id: page_ids[0] })).toBe(true);
        await fetchPromise
        expect(exercises.isFetching({ page_id: page_ids[0] })).toBe(false);
    });

});
