import { map } from 'lodash';
import {
    BaseModel, model, runInAction, array, hydrateModel, modelize, observable, computed, action, getParentOf,
} from 'shared/model';
import Exercise from './exercises/exercise';
import urlFor from '../api'

class Clause extends BaseModel {

    @observable filter = 'uid';
    @observable value = '';

    constructor() {
        super();
        modelize(this);
    }

    get search() { return getParentOf<Search>(this) }

    @computed get description() {
        return `Search by ${this.filter}`;
    }

    @action.bound setFilter(filter: string) {
        this.filter = filter;
        this.search.currentPage = 1;
    }

    @action.bound onKey(e: any){
        if(e.keyCode == 13 && e.shiftKey == false) {
            this.search.perform();
        }
    }

    @action.bound onSelect(evKey: string) {
        this.filter = evKey;
    }

    @action.bound setValue({ target: { value } }: any) {
        this.value = value;
    }

    get asQuery() {
        return `${this.filter}:"${this.value}"`;
    }
}

export default
class Search extends BaseModel {

    @model(Clause) clauses = array<Clause>()
    @model(Exercise) exercises = array<Exercise>()
    @observable total_count = 0;
    @observable perPageSize = 25;
    @observable currentPage = 1;

    constructor() {
        super();
        modelize(this);
        if (!this.clauses.length) { this.clauses.push(hydrateModel(Clause, {}, this)) }
    }

    @action.bound execute() {
        this.perform();
    }

    @action.bound setPerPageSize(size: number) {
        const firstVisibleExercise = (this.perPageSize * (this.currentPage - 1)) + 1;
        this.perPageSize = Number(size);
        // keep cursor showing roughly the same exercise
        this.currentPage = Math.floor(firstVisibleExercise / this.perPageSize) + 1;
        this.perform();
    }


    @action.bound onPageChange(pg: number) {
        this.currentPage = pg;
        this.perform();
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
    async perform() {
        const { total_count, items } = await this.api.request<{ total_count: number, items: Exercise[] }>(
            urlFor('search', {}, {
                q: map(this.clauses, 'asQuery').join(' '),
                per_page: this.perPageSize,
                page: this.currentPage,
            })
        )


        runInAction(() => {
            this.total_count = total_count;
            this.exercises.replace( items.map((ex:any) => hydrateModel(Exercise, ex, this)) );
        })
    }

}