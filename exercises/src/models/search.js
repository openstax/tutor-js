import { map } from 'lodash';
import lazyGetter from 'shared/helpers/lazy-getter';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, hasMany, observable, computed, action,
} from 'shared/model';

import Exercise from './exercises/exercise';


@identifiedBy('search/clause')
class Clause extends BaseModel {

  @observable filter = 'uid';
  @observable value = '';
  @belongsTo({ model: 'search' }) search;

  @computed get description() {
    return `Search by ${this.filter}`;
  }

  @action.bound onKey(e) {
    if(e.keyCode == 13 && e.shiftKey == false) {
      this.search.perform();
    }
  }

  @action.bound onSelect(evKey) {
    this.filter = evKey;
  }

  @action.bound setValue({ target: { value } }) {
    this.value = value;
  }

  get asQuery() {
    return `${this.filter}:"${this.value}"`;
  }
}

export default
@identifiedBy('search')
class Search extends BaseModel {

  @hasMany({ model: Clause, inverseOf: 'search' }) clauses;
  @hasMany({ model: Exercise }) exercises;
  @observable total_count;

  constructor() {
    super();
    if (!this.clauses.length) { this.clauses.push({}); }
  }

  @action.bound execute() {
    this.perform();
  }

  onComplete({ data: { total_count, items } }) {
    this.total_count = total_count;
    this.exercises = items;
  }

  //called by api
  perform() {
    return { query: { q: map(this.clauses, 'asQuery').join(' ') } };
  }

};
