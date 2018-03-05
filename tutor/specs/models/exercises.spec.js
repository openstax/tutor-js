import { ExercisesMap as Exercises } from '../../src/models/exercises';
import Factory, { FactoryBot } from '../factories';
import { sampleSize, keys, forEach } from 'lodash';

describe('Exercises Map', () => {
  let book, exercises, page_ids;

  beforeEach(() => {
    book = Factory.book();
    exercises = new Exercises();
    page_ids = sampleSize(book.pages.byId.keys(), 3);
  });

  it('collects important tag info', () => {
    const exercise = Factory.tutorExercise();
    expect(exercise.tags.importantInfo).toEqual({
      section: '', lo: 'lo:stax-phys:1-2-1', tagString: [ 'blooms:3', 'dok:3' ],
    });
  });


  it('can be loaded and group by page', () => {
    page_ids.forEach(page_id => { expect(exercises.isFetching({ book, page_id })).toBe(false); });

    expect(
      exercises.fetch({ book, page_ids })
    ).toEqual({ url: `ecosystems/${book.id}/exercises`, query: { page_ids } });

    page_ids.forEach(page_id => { expect(exercises.isFetching({ book, page_id })).toBe(true); });

    const items = page_ids.map(page_id =>
      FactoryBot.create('TutorExercise', { page_uuid: book.pages.byId.get(page_id).uuid }),
    );

    exercises.onLoaded({ data: { items } }, [{ book, page_ids }]);

    page_ids.forEach(page_id => { expect(exercises.isFetching({ book, page_id })).toBe(false); });
    page_ids.forEach(page_id => { expect(exercises.hasFetched({ book, page_id })).toBe(true); });

    expect(keys(exercises.byPageId).sort()).toEqual( page_ids.sort() );
    forEach(exercises.byPageId, (exs, pageId) => {
      expect(exs).toHaveLength(1);
      expect(exs[0].page.id).toEqual(pageId);
    });

  });

});
