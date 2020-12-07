import Factories from '../factories';

describe('Exercise Model', () => {
  let exercise;
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

  it('gets author names', () => {
    expect(exercise.authors.names()).toEqual(exercise.authors.map(a=>a.name));
  });

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
    exercise.published_at = new Date();
    expect(exercise.isPublishable).toBe(false);
  });

  it('sets tags uniquely', () => {
    const book = exercise.tags.withType('book');
    book.value = 'uniq';
    const secondBook = exercise.tags[
      exercise.tags.push({ type: 'book', value: 'new' }) - 1
    ];
    const len = exercise.tags.length;
    exercise.tags.setUniqueValue(secondBook, 'uniq');
    expect(exercise.tags.length).toEqual(len - 1);
    expect(exercise.tags.includes({ type: 'book', value: 'uniq' })).toBe(true);
    expect(exercise.tags.includes({ type: 'book', value: 'new' })).toBe(false);
  });

  it('can replace all tags', () => {
    exercise.tags.push({ type: 'book', value: 'first' });
    exercise.tags.push({ type: 'book', value: 'second' });
    exercise.tags.replaceType('book', [{ value: 'only' }]);
    const bookTags = exercise.tags.withType('book', { multiple: true });
    expect(bookTags).toHaveLength(1);
    expect(bookTags[0].value).toEqual('only');
  });
});
