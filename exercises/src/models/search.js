import { map } from 'lodash';
import {
  BaseModel, identifiedBy, belongsTo, hasMany, observable, computed, action,
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

  @action.bound setFilter(filter) {
    this.filter = filter;
    this.search.currentPage = 1;
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
  @observable total_count = 0;
  @observable perPageSize = 25;
  @observable currentPage = 1;

  constructor() {
    super();
    if (!this.clauses.length) { this.clauses.push({}); }
  }

  @action.bound execute() {
    this.perform();
  }

  @action.bound setPerPageSize(size) {
    const firstVisibleExercise = (this.perPageSize * (this.currentPage - 1)) + 1;
    this.perPageSize = Number(size);
    // keep cursor showing roughly the same exercise
    this.currentPage = Math.floor(firstVisibleExercise / this.perPageSize) + 1;
    this.perform();
  }


  @action.bound onPageChange(pg) {
    this.currentPage = pg;
    this.perform();
  }

  onComplete({ data: { total_count, items } }) {
    this.total_count = total_count;
    this.exercises = items;
  }

  @computed get pagination() {
    if (!this.total_count) {
      return null;
    }

    return {
      currentPage: this.currentPage ,
      totalPages: Math.floor(this.total_count / this.perPageSize) + 1,
      onChange: this.onPageChange,
    };
  }


  //called by api
  perform() {
    return {
      query: {
        q: map(this.clauses, 'asQuery').join(' '),
        per_page: this.perPageSize,
        page: this.currentPage,
      },
    };
  }

}
