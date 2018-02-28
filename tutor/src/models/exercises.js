import Map from 'shared/model/map';
import { computed, action, observable } from 'mobx';
import Exercise from './exercises/exercise';
import { extend, groupBy, filter } from 'lodash';
import { readonly } from 'core-decorators';

const MIN_EXCLUDED_COUNT = 5;
const COMPLETE = Symbol('COMPLETE');
const PENDING = Symbol('PENDING');

const fetchKey = (ecosystem_id, page_id) => `${ecosystem_id}.${page_id}`

export class ExercisesMap extends Map {

  @readonly fetched = observable.map();

  @computed get byPageId() {
    return groupBy(this.array, 'page.id');
  }

  @computed get all() {
    return this;
  }

  @computed get homework() {
    return this.where(e => e.isHomework);
  }

  @computed get reading() {
    return this.where(e => e.isReading);
  }

  isMinimumExcludedForPage(page) {
    const exercises = this.byPageId[ page.id ];
    const nonExcluded = filter(exercises, { is_excluded: false }).length;
    if ((MIN_EXCLUDED_COUNT == nonExcluded) ||
      (nonExcluded == 0 && exercises.length <= MIN_EXCLUDED_COUNT)
    ) {
      return nonExcluded;
    } else {
      return false;
    }
  }

  // called by API
  fetch({ book, page_ids }) {

    page_ids.forEach(pgId => this.fetched.set(fetchKey(book.id, pgId), PENDING));

    return {
      url: `ecosystems/${book.id}/exercises`,
      params: { page_ids },
    };
  }

  hasFetched({ book, page_id }) {
    return this.fetched.has(fetchKey(book.id, page_id));
  }

  isFetching({ book, page_id }) {
    return this.fetched.get(fetchKey(book.id, page_id)) === PENDING;
  }

  ensureLoaded({ book, page_id }) {
    if (!this.hasFetched({ book, page_id })) {
      this.fetch({ book, page_ids: [ page_id ] });
    }
  }

  @action onLoaded(reply, [{ book, page_ids }]) {
    page_ids.forEach(pgId => this.fetched.set(fetchKey(book.id, pgId), COMPLETE));
    reply.data.items.forEach((ex) => {
      const exercise = this.get(ex.id);
      exercise ? exercise.update(ex) : this.set(ex.id, new Exercise(extend(ex, { book, page_ids })));
    });
  }

}


const exercisesMap = new ExercisesMap();

export default exercisesMap;
