import { hydrateModel, ID, Map, modelize, observable } from 'shared/model'
import type Course from './course'
import type { User } from './user'
import { computed, action, toJS } from 'mobx';
import Exercise from './exercises/exercise';
import { groupBy, filter, isEmpty, find, uniq, map, sortBy } from 'lodash';
import { readonly } from 'core-decorators';
import Page from './reference-book/node'
import ReferenceBook from './reference-book'
import urlFor from '../api'
import { TutorExerciseObj } from './types'

const MIN_EXCLUDED_COUNT = 5;
const COMPLETE = Symbol('COMPLETE');
const PENDING = Symbol('PENDING');

export { COMPLETE, PENDING };

type FETCHED_TYPE = typeof COMPLETE | typeof PENDING

export const exerciseSort = (exercises: Exercise[], course: Course, user: User) => {
    return sortBy(exercises, (ex) => {
        const cs = ex.page.chapter_section.asNumber;
        if (ex.belongsToUser(user)) {
            return [cs, 1];
        } else if (course.teacher_profiles.find(tp => ex.belongsToUser(tp))) {
            return [cs, 2];
        } else if (!ex.belongsToOpenStax){
            return [cs, 3];
        }
        return [cs, 4];
    });
};


interface FetchArg {
    book?: ReferenceBook,
    course?: Course,
    ecosystem_id?: ID,
    page_ids?: ID[],
    exercise_ids?: ID[],
    limit?: string | boolean,
    query?: any,
    action?: string,
}

export class ExercisesMap extends Map<ID, Exercise> {
    @readonly fetched = observable.map<ID, FETCHED_TYPE>()

    constructor() {
        super();
        modelize(this)
    }

    @computed get byPageId() {
        return groupBy(this.array, 'page.id');
    }

    @computed get uniqPageIds() {
        return uniq(map(this.array, 'page.id'));
    }

    noneForPageIds(pageIds: ID[] = []) {
        return !find(pageIds, pgId => !isEmpty(this.byPageId[pgId]));
    }

    forPageId(pageId: ID) {
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

    isMinimumExcludedForPage(page: Page) {
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

    clear({ exceptIds }: {exceptIds?:ID[]} = {}) {
        if (exceptIds) {
            const ids = exceptIds.map(this.keyType);
            this.keys().forEach((k) => {
                if (!ids.includes(k as number)) {
                    this._map.delete(k);
                }
            });
        } else {
            this._map.clear();
        }
    }


    // called by API
    async fetch({
        book,
        course,
        ecosystem_id,
        page_ids,
        exercise_ids,
        limit = 'homework_core',
        query = {},
        action = 'exercises',
    }: FetchArg) {
        if (!ecosystem_id) {
            if (course && !book) {
                book = course.referenceBook;
            }
            if (book) {
                ecosystem_id = book.id;
            }
        }
        if (page_ids) {
            page_ids.forEach(pgId => this.fetched.set(pgId, PENDING));
            query.page_ids = uniq(toJS(page_ids));
        }
        if(course) {
            query.course_id = course.id;
        }
        const params = { ecosystemId: ecosystem_id as string, action }
        let replyData: any
        if (exercise_ids) {
            query.exercise_ids = uniq(toJS(exercise_ids));
            replyData = await this.api.request(urlFor('fetchExercises', params, query))
        } else if (typeof limit == 'string') {
            replyData = await this.api.request(urlFor('fetchLimitedExercises', { ...params, limit }, query))
        } else {
            throw new Error('must specify limit or exercise_ids')
        }

        this.onLoaded(replyData, course, book, page_ids)
    }

    @action onLoaded(exercises: TutorExerciseObj[], course?: Course, book?: ReferenceBook, page_ids?: ID[]) {
        if (course && !book) {
            book = course.referenceBook;
        }

        if (page_ids) {
            page_ids.forEach(pgId => this.fetched.set(pgId, COMPLETE));
        }
        exercises.forEach((ex) => {
            const exercise = this.get(ex.id);
            exercise ? exercise.update(ex) : this.set(ex.id, hydrateModel(Exercise, { ...ex, book }));
        });
    }

    hasFetched({ page_id }: { page_id: ID }) {
        return this.fetched.has(page_id);
    }

    isFetching({ page_id, pageIds }: { page_id?: ID, pageIds?: ID[] }) {
        if (page_id) {
            return this.fetched.get(page_id) === PENDING;
        } else if (pageIds) {
            return Boolean(pageIds.find(pgId => this.fetched.get(pgId) === PENDING));
        }
        return false;
    }

    ensureExercisesLoaded({ book, course, ecosystem_id, exercise_ids, limit, ...query }: FetchArg) {
        const unFetchedExerciseIds = filter(exercise_ids, exId => !this.get(exId));
        if (!isEmpty(unFetchedExerciseIds)) {
            return this.fetch({
                book, course, ecosystem_id, exercise_ids: unFetchedExerciseIds, limit, query,
            });
        }
        return Promise.resolve(this);
    }

    ensurePagesLoaded({ book, course, page_ids, limit }: FetchArg) {
        const unFetchedPageIds = filter(page_ids, page_id =>
            !this.isFetching({ page_id }) && !this.hasFetched({ page_id })
        );
        if (!isEmpty(unFetchedPageIds)) {
            this.fetch({ book, course, page_ids: unFetchedPageIds, limit });
        }
    }

    @action deleteByExerciseId(exerciseId: ID) {
        this._map.delete(Number(exerciseId));
    }
    async deleteExercise(course: Course, exercise: Exercise) {
        await this.api.request(
            urlFor('deleteExercise', {
                courseId: course.id, exerciseNumber: String(exercise.content.number),
            })
        )
        this.deleteByExerciseId(exercise.id);
    }

    async createExercise({ course, data }: { course: Course, data: Exercise }): Promise<Exercise> {
        const reply = await this.api.request(urlFor('createExercise', { courseId: course.id }), { data })
        return await this.onExerciseCreated(course, reply)
    }

    @action async onExerciseCreated(course: Course, data: any): Promise<Exercise> {
        // remove any existing copies
        const existing = [...this.array];
        existing.forEach((ex) => {
            if (ex.content.number == data.content.number) {
                this.delete(ex.id);
            }
        });
        await this.fetch({ course, exercise_ids: [data.id] });
        return Promise.resolve(this.get(data.id) as Exercise)
    }
}

const exercisesMap = new ExercisesMap();

export { Exercise };
export default exercisesMap;
