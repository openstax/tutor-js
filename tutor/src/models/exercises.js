import Map from 'shared/model/map';
import { computed, action, observable } from 'mobx';
import Exercise from './exercises/exercise';
import { extend, groupBy, filter } from 'lodash';
import { readonly } from 'core-decorators';

const COMPLETE = Symbol('COMPLETE');
const PENDING = Symbol('PENDING');

const fetchKey = (ecosystem_id, page_id) => `${ecosystem_id}.${page_id}`

export class ExercisesMap extends Map {

  @readonly fetched = observable.map();

  @computed get byPage() {
    return groupBy(this.array, 'page_id');
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

  // called by API
  fetch({ ecosystem_id, page_ids }) {
    this.fetched.set(fetchKey(ecosystem_id, page_id), PENDING);
    return {
      url: `ecosystems/${ecosystem_id}/exercises`,
      params: { page_ids },
    };
  }

  hasFetched({ ecosystem_id, page_id }) {
    return this.fetched.has(fetchKey(ecosystem_id, page_id));
  }

  isFetching({ ecosystem_id, page_id }) {
    return this.fetched.get(fetchKey(ecosystem_id, page_id)) === PENDING;
  }

  ensureLoaded({ ecosystem_id, page_id }) {
    if (!this.hasFetched({ ecosystem_id, page_id })) {
      this.fetch({ ecosystem_id, page_ids: [ page_id ] });
    }
  }

  @action onLoaded(reply, [{ ecosystem_id, page_ids }]) {
    page_ids.forEach(pgId => this.fetched.set(fetchKey(ecosystem_id, pgId), COMPLETE));
    reply.data.items.forEach((ex) => {
      const exercise = this.get(ex.id);
      exercise ? exercise.update(ex) : this.set(ex.id, new Exercise(extend(ex, { ecosystem_id, page_ids })));
    });
  }

}


const exercisesMap = new ExercisesMap();

export default exercisesMap;
