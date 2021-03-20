import { filter, find, remove } from 'lodash';
import { action } from 'mobx';
import { model, modelize, hydrate } from '../../model'
import { ExerciseTag as Tag } from './tag'

class TagsAssociation {

    @model(Tag) all: Tag[] = []

    constructor() {
        modelize(this)
    }

    push(attrs: any) { return this.all.push(attrs) }

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
            this.all.push(hydrate(Tag, { type: type, value: tag.value }))
        });
    }

    removeType(type: string) {
        remove(this.all, { type })
    }

    setUniqueValue(tag:Tag, value: string) {
        const existing = find(this.all, { type: tag.type, value: value });
        if (existing) {
            remove(this.all, tag)
        }
        tag.value = value;
    }

    includes({ type, value }: { type: string, value: string }) {
        return Boolean(find(this.all, { type, value }));
    }

    hydrate(tags: any) {
        this.all = tags
    }
}


export { TagsAssociation, Tag };
