import Map from 'shared/model/map';
import { computed, action, observable, toJS } from 'mobx';
import Exercise from './exercises/exercise';
import { extend, groupBy, filter } from 'lodash';
import { readonly } from 'core-decorators';

const MIN_EXCLUDED_COUNT = 5;
const COMPLETE = Symbol('COMPLETE');
const PENDING = Symbol('PENDING');

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
  fetch({ book, course, page_ids }) {
    let id, url;
    if (course) {
      id = course.id;
      url = `courses/${id}/exercises/homework_core`;
    } else {
      id = book.id;
      url = `ecosystems/${id}/exercises`;
    }
    page_ids.forEach(pgId => this.fetched.set(pgId, PENDING));
    return {
      url, query: { page_ids: toJS(page_ids) },
    };
  }

  hasFetched({ page_id }) {
    return this.fetched.has(page_id);
  }

  isFetching({ page_id }) {
    return this.fetched.get(page_id) === PENDING;
  }

  ensureLoaded({ book, page_id }) {
    if (!this.hasFetched({ book, page_id })) {
      this.fetch({ book, page_ids: [ page_id ] });
    }
  }

  @action onLoaded(reply, [{ book, course, page_ids }]) {
    page_ids.forEach(pgId => this.fetched.set(pgId, COMPLETE));
    reply.data.items.forEach((ex) => {
      const exercise = this.get(ex.id);
      exercise ? exercise.update(ex) : this.set(ex.id, new Exercise(extend(ex, { book, course })));
    });
  }

}


const exercisesMap = new ExercisesMap();

export { Exercise };
export default exercisesMap;
