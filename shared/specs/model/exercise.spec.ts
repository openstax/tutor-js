import Exercise from 'shared/model/exercise';
import Factories from '../factories';

describe('Exercise Model', () => {
    let exercise: Exercise;

    beforeEach(() => exercise = Factories.exercise({}));

    it('can move questions up/down', () => {
        exercise = Factories.exercise({ multipart: true });
        const second = exercise.questions[1];
        exercise.moveQuestion(second, -1);
        expect(exercise.questions[0]).toBe(second);
        expect(() =>
            exercise.moveQuestion(second, -1)
        ).toThrow();

        const nextToLast = exercise.questions[exercise.questions.length - 2];
        exercise.moveQuestion(nextToLast, 1);
        expect(exercise.questions[exercise.questions.length - 1]).toBe(nextToLast);
        expect(() =>
            exercise.moveQuestion(nextToLast, 1)
        ).toThrow();
    });

    it('has number/value', () => {
        expect(exercise.number).toBeGreaterThan(0)
        expect(exercise.version).toBeGreaterThan(0)
    })

    it('calculates validity', () => {
        expect(exercise.validity.valid).toBe(true);
        const dok = exercise.tags.withType('dok');
        dok.value = '';
        expect(exercise.validity.valid).toBe(false);
        dok.value = '3';
        expect(exercise.validity.valid).toBe(true);
        exercise.questions[0].stem_html = '';
        expect(exercise.questions[0].validity.valid).toBe(false);
        expect(exercise.validity.valid).toBe(false);
    });

    it('toggles multipart', () => {
        expect(exercise.isMultiPart).toBe(false);
        exercise.toggleMultiPart();
        expect(exercise.isMultiPart).toBe(true);
        expect(exercise.questions.length).toBe(2);
        exercise.toggleMultiPart();
        expect(exercise.isMultiPart).toBe(false);
        expect(exercise.questions.length).toBe(1);
    });

    it('tests isPublishable', () => {
        expect(exercise.isPublishable).toBe(true);
        exercise.uid = ''
        expect(exercise.isNew).toBe(true)
        expect(exercise.isPublishable).toBe(false);
        exercise.uid = '1@1'
        expect(exercise.isPublishable).toBe(true);
        exercise.published_at = new Date()
        expect(exercise.isPublishable).toBe(false);
    });

    it('sets tags uniquely', () => {
        const book = exercise.tags.withType('book');
        book.value = 'uniq';
        const secondBook = exercise.tags.all[
            exercise.tags.push({ type: 'book', value: 'new' }) - 1
        ];
        const len = exercise.tags.all.length;
        exercise.tags.setUniqueValue(secondBook, 'uniq');
        expect(exercise.tags.all.length).toEqual(len - 1);
        expect(exercise.tags.includes({ type: 'book', value: 'uniq' })).toBe(true);
        expect(exercise.tags.includes({ type: 'book', value: 'new' })).toBe(false);
    });

    it('can replace all of a tag', () => {
        exercise.tags.push({ type: 'assignment-type', value: 'reading' })
        exercise.tags.replaceType('assignment-type', [])
        expect(exercise.tags.withType('assignment-type')).toBeUndefined()
    })

    it('can replace all tags', () => {
        exercise.tags.push({ type: 'book', value: 'first' } as any)
        exercise.tags.push({ type: 'book', value: 'second' } as any);
        exercise.tags.replaceType('book', [{ value: 'only' }] as any);
        const bookTags = exercise.tags.withType('book', true);
        expect(bookTags).toHaveLength(1);
        expect(bookTags[0].value).toEqual('only');
    });
});
