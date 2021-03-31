import { filter, find, remove } from 'lodash';
import { model, modelize, action, hydrateModel } from '../../model'
import Tag from './tag'

export default class TagsAssociation {

    @model(Tag) all: Tag[] = []

    constructor() {
        modelize(this)
    }
    remove(tag: Tag){ return remove(this.all, tag) }
    push(attrs: any) { return this.all.push(hydrateModel(Tag, attrs)) }
    clear() { this.all.splice(0, this.all.length) }
    get length() { return this.all.length }

    withType(type: string): Tag // eslint-disable-line
    withType(type: string, multiple:false): Tag // eslint-disable-line
    withType(type: string, multiple:true): Tag[] // eslint-disable-line
    withType(type: string, multiple = false) { // eslint-disable-line no-dupe-class-members
        return multiple ? filter(this.all, { type }) : find(this.all, { type });
    }

    @action findOrAddWithType(type: string) {
        return this.withType(type) || this.all[ this.all.push(new Tag(`${type}:`)) - 1 ];
    }

    @action replaceType(type: string, tags: Tag[]) {
        this.removeType(type)
        tags.forEach((tag) => {
            this.all.push(hydrateModel(Tag, { type: type, value: tag.value }))
        });
    }

    @action removeType(type: string) {
        remove(this.all, { type })
    }

    @action setUniqueValue(tag:Tag, value: string) {
        const existing = find(this.all, { type: tag.type, value: value });
        if (existing) {
            remove(this.all, tag)
        }
        tag.value = value;
    }

    includes({ type, value }: { type: string, value: string }) {
        return Boolean(find(this.all, { type, value }));
    }

    hydrateModel(tags: any[]) {
        this.all.splice(0, this.all.length, ...tags.map(t => hydrateModel(Tag, t)))
    }
}

export { Tag }
