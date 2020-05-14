import Map from 'shared/model/map';
import { computed, action, toJS } from 'mobx';
import Exercise from './exercises/exercise';
import { extend, groupBy, filter, isEmpty, find } from 'lodash';
import { readonly } from 'core-decorators';

const MIN_EXCLUDED_COUNT = 5;
const COMPLETE = Symbol('COMPLETE');
const PENDING = Symbol('PENDING');

export { COMPLETE, PENDING };

export class ExercisesMap extends Map {

  @readonly fetched = new Map();

  @computed get byPageId() {
    return groupBy(this.array, 'page.id');
  }

  noneForPageIds(pageIds) {
    return !find(pageIds, pgId => !isEmpty(this.byPageId[pgId]));
  }

  forPageId(pageId) {
    return this.byPageId[pageId] || [];
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
    const exercises = this.forPageId(page.id);
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
  fetch({ book, course, page_ids, exercise_ids, limit = 'homework_core', query = {} }) {
    if (course && !book) {
      book = course.referenceBook;
    }
    let url = `ecosystems/${book.id}/exercises`;
    if (limit) { url += `/${limit}`; }
    if (page_ids) {
      page_ids.forEach(pgId => this.fetched.set(pgId, PENDING));
      query.page_ids = toJS(page_ids);
    }
    if(course) {
      query.course_id = course.id;
    }
    if (exercise_ids) {
      query.exercise_ids = toJS(exercise_ids);
    }
    return {
      url, query,
    };
  }

  hasFetched({ page_id }) {
    return this.fetched.has(page_id);
  }

  isFetching({ page_id, pageIds }) {
    if (page_id) {
      return this.fetched.get(page_id) === PENDING;
    } else if (pageIds) {
      return Boolean(pageIds.find(pgId => this.fetched.get(pgId) === PENDING));
    }
    return false;
  }

  ensureExercisesLoaded({ book, course, exercise_ids, limit, ...query }) {
    const unFetchedExerciseIds = filter(exercise_ids, exId => !this.get(exId));
    if (!isEmpty(unFetchedExerciseIds)) {
      return this.fetch({
        book, course, exercise_ids: unFetchedExerciseIds, limit, query,
      });
    }
    return Promise.resolve(this);
  }

  ensurePagesLoaded({ book, course, page_ids, limit }) {
    const unFetchedPageIds = filter(page_ids, page_id =>
      !this.isFetching({ page_id }) && !this.hasFetched({ page_id })
    );
    if (!isEmpty(unFetchedPageIds)) {
      this.fetch({ book, course, page_ids: unFetchedPageIds, limit });
    }
  }

  @action onLoaded(reply, [{ course, book, page_ids }]) {
    if (course && !book) {
      book = course.referenceBook;
    }
    if (page_ids) {
      page_ids.forEach(pgId => this.fetched.set(pgId, COMPLETE));
    }
    reply.data.items.forEach((ex) => {
      const exercise = this.get(ex.id);
      exercise ? exercise.update(ex) : this.set(ex.id, new Exercise(extend(ex, { book })));
    });
  }

}


const exercisesMap = new ExercisesMap();

export { Exercise };
export default exercisesMap;
