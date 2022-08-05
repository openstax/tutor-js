import { map } from 'lodash';
import {
    BaseModel, model, runInAction, array, hydrateModel, modelize, observable, computed, action, getParentOf,
} from 'shared/model';
import { override } from 'mobx'
import Exercise from './exercises/exercise';
import urlFor from '../api'
import pluralize from 'pluralize';
import { toSentence } from 'shared/helpers/string'

interface SearchResponse {
    total_count: number
    items: Exercise[]
}

class Clause extends BaseModel {

    const formatFilters = {
      'multiple-choice': 'Multiple Choice',
      'free-response': 'Free Response',
      'true-false': 'True or False'
    };

    const tfFilters = {
      'true': 'True',
      'false': 'False'
    }

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

    @computed get asString() {
        return `${this.filter}="${this.value}"`;
    }

    @action.bound setFilter(filter: string) {
        this.filter = filter;
        this.search.currentPage = 1;
        switch(filter) {
          case 'format':
            this.setValue(Object.keys(this.formatFilters)[0]);
            break;
          case 'solutions_are_public':
            this.setValue(Object.keys(this.tfFilters)[0]);
            break;
          default:
            this.setValue('');
        }
    }

    @action.bound onKey(e: any){
        if(e.keyCode == 13 && e.shiftKey == false) {
            this.search.perform();
        }
    }

    @action.bound onSelect(evKey: string) {
        this.filter = evKey;
    }

    @action.bound setValue(value: string) {
        this.value = value;
    }

    @action.bound onChange({ target: { value } }: any) {
        this.setValue(value);
    }

    get asQuery() {
        return `${this.filter}:"${this.value}"`;
    }
}

export default class Search extends BaseModel {

    @model(Clause) clauses = array<Clause>()

    @model(Exercise) exercises = array<Exercise>()
    @observable total_count = 0
    @observable perPageSize = 25
    @observable currentPage = 1
    @observable bookSlug = ''
    @observable sectionSlug = ''
    @observable isPending = false

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

    @action.bound reset() {
        this.bookSlug = ''
        this.sectionSlug = ''
    }

    @computed get title() {
        if (!this.exercises.length) {
            return 'Exercise Search';
        }
        return `${pluralize('exercise', this.exercises.length, true)} found for ${toSentence(this.clauses.map(c => c.asString))}`
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
            currentPage: this.currentPage,
            totalPages: this.exercises.length == this.total_count ? 1 : Math.floor(this.total_count / this.perPageSize) + 1,
            onChange: this.onPageChange,
        };
    }

    @action async fetchAll() {
        let { totalPages } = this.pagination || { totalPages: 1 }
        let totalCount = this.total_count;
        let exercises: Exercise[] = []
        this.isPending = true
        for(let pg = 1; pg<totalPages+1;pg++){
            const { total_count, items } = await this.fetchPage(pg)
            totalPages = Math.floor(total_count / this.perPageSize) + 1
            totalCount = total_count
            exercises = exercises.concat(items)
        }
        runInAction(() => {
            this.total_count = totalCount;
            this.exercises.replace(exercises)
            this.isPending = false
        })
    }

    async fetchPage(page: number) {
        const clauses = this.clauses.filter(c => c.value)
        if (this.bookSlug) {
            if (this.sectionSlug) {
                clauses.push(hydrateModel(
                    Clause,
                    { filter: 'tag', value: `module-slug:${this.bookSlug}:${this.sectionSlug}` },
                    this
                ))
            } else {
                clauses.push(hydrateModel(
                    Clause, { filter: 'tag', value: `book-slug:${this.bookSlug}` }, this
                ))
            }
        }

        return await this.api.request<SearchResponse>(
            urlFor('search', {}, {
                q: map(clauses, 'asQuery').join(' '),
                per_page: this.perPageSize,
                page,
            })
        )
    }

    @override update(clause: string) {
        const [filter, value] = clause.split(':')
        this.clauses.replace([{ filter, value } as any])

    }
    //called by api
    @action async perform() {
        this.isPending = true
        const { total_count, items } = await this.fetchPage(this.currentPage)
        runInAction(() => {
            this.total_count = total_count;
            this.exercises.replace(items)
            this.isPending = false
        })
    }

}
