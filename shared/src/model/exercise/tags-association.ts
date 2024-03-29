import { filter, find, remove } from 'lodash';
import { model, modelize, action, hydrateModel, array } from '../../model'
import Tag from './tag'

export default class TagsAssociation {

    @model(Tag) all = array<Tag>()

    constructor() {
        modelize(this)
    }
    remove(tag: Tag) { return remove(this.all, elt => elt == tag) }
    push(attrs: any) { return this.all.push(hydrateModel(Tag, attrs)) }
    clear() { this.all.splice(0, this.all.length) }
    get length() { return this.all.length }

    withType(type: string, multiple?: false): Tag // eslint-disable-line
    withType(type: string, multiple: true): Tag[] // eslint-disable-line
    withType(type: string, multiple = false) { // eslint-disable-line no-dupe-class-members
        return multiple ? filter(this.all, { type }) : find(this.all, { type });
    }

    withTypeAndSpecifier(type: string, specifier: string, multiple?: false): Tag | undefined // eslint-disable-line
    withTypeAndSpecifier(type: string, specifier: string, multiple: true): Tag[] // eslint-disable-line
    withTypeAndSpecifier(type: string, specifier: string, multiple = false) { // eslint-disable-line no-dupe-class-members
        return multiple ? filter(this.all, { type, specifier }) : find(this.all, { type, specifier });
    }

    @action findOrAddWithType(type: string) {
        return this.withType(type) || this.all[ this.all.push(new Tag(`${type}:`)) - 1 ];
    }

    @action findOrAddWithTypeAndSpecifier(type: string, specifier: string) {
        return this.withType(type, true).find(tag => tag.specifier === specifier) ||
               this.all[ this.all.push(new Tag(`${type}:${specifier}:`)) - 1 ];
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

    @action removeTypeAndSpecifier(type: string, specifier: string) {
        remove(this.all, { type, specifier })
    }

    @action setUniqueValue(tag:Tag, value: string) {
        const existing = find(this.all, { type: tag.type, value: value });
        if (existing) this.remove(tag);
        tag.value = value;
    }

    includes({ type, value }: { type: string, value: string }) {
        return Boolean(find(this.all, { type, value }));
    }

    hydrate(tags: any[]) {
        this.all.splice(0, this.all.length, ...tags.map(t => hydrateModel(Tag, t)))
    }

    serialize() {
        return this.all.map(i => i.serialize())
    }
}

export { Tag }
