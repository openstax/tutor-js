import Map from 'shared/model/map';
import { computed, action, toJS } from 'mobx';
import Exercise from './exercises/exercise';
import { extend, groupBy, filter, isEmpty, find, uniq, map, sortBy } from 'lodash';
import { readonly } from 'core-decorators';

const MIN_EXCLUDED_COUNT = 5;
const COMPLETE = Symbol('COMPLETE');
const PENDING = Symbol('PENDING');

export { COMPLETE, PENDING };


export const exerciseSort = (exercises, course, user) => {
  return sortBy(exercises, (ex) => {
    if (ex.belongsToUser(user)) {
      return 1;
    } else if (course.teacher_profiles.find(tp => ex.belongsToUser(tp))) {
      return 2;
    } else if (!ex.belongsToOpenStax){
      return 3;
    }
    return 4;
  });
};


export class ExercisesMap extends Map {

  @readonly fetched = new Map();

  @computed get byPageId() {
    return groupBy(this.array, 'page.id');
  }

  @computed get uniqPageIds() {
    return uniq(map(this.array, 'page.id'));
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

  clear({ exceptIds } = {}) {
    if (exceptIds) {
      exceptIds = exceptIds.map(this.keyType);
      this.keys().forEach((k) => {
        if (!exceptIds.includes(k)) {
          this._map.delete(k);
        }
      });
    } else {
      this._map.clear();
    }
  }


  // called by API
  fetch({
    book,
    course,
    ecosystem_id,
    page_ids,
    exercise_ids,
    limit = 'homework_core',
    query = {},
    action = 'exercises',
  }) {
    if (!ecosystem_id) {
      if (course && !book) {
        book = course.referenceBook;
      }
      ecosystem_id = book.id;
    }

    let url = `ecosystems/${ecosystem_id}/${action}`;

    if (page_ids) {
      page_ids.forEach(pgId => this.fetched.set(pgId, PENDING));
      query.page_ids = uniq(toJS(page_ids));
    }
    if(course) {
      query.course_id = course.id;
    }
    if (exercise_ids) {
      query.exercise_ids = uniq(toJS(exercise_ids));
    } else if (limit) {
      url += `/${limit}`;
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

  ensureExercisesLoaded({ book, course, ecosystem_id, exercise_ids, limit, ...query }) {
    const unFetchedExerciseIds = filter(exercise_ids, exId => !this.get(exId));
    if (!isEmpty(unFetchedExerciseIds)) {
      return this.fetch({
        book, course, ecosystem_id, exercise_ids: unFetchedExerciseIds, limit, query,
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

  @action deleteByExerciseId(exerciseId) {
    this._map.delete(parseInt(exerciseId, 10));
  }
  deleteExercise(course, exercise) {
    return { courseId: course.id, exerciseNumber: exercise.content.number };
  }
  onExerciseDeleted(resp, [ , exercise]) {
    this.deleteByExerciseId(exercise.id);
  }

  createExercise({ course, data }) {
    return { 
      courseId: course.id,
      data,
    };
  }
  async onExerciseCreated({ data }, [{ course }]) {
    // remove any existing copies
    const existing = [...this.array];
    existing.forEach((ex) => {
      if (ex.content.number == data.content.number)
        this.delete(ex.id);
    });

    await this.fetch({ course, exercise_ids: [data.id] });
  }
}

const exercisesMap = new ExercisesMap();

export { Exercise };
export default exercisesMap;
