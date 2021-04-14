import { BaseModel, modelize, observable } from 'shared/model';
import { isArray, reduceRight } from 'lodash';
import { computed } from 'mobx';
import { readonly } from 'core-decorators'

export class ChapterSection extends BaseModel {

    @readonly static blank = new ChapterSection()

    constructor(arg: ChapterSection | [number, number] | string = '') {
        super();
        modelize(this);
        if (isArray(arg)) {
            [this.chapter, this.section] = arg;
        } else if (arg instanceof ChapterSection) {
            [this.chapter, this.section] = arg.split();
        } else {
            [this.chapter, this.section] = arg.split('.').map(Number);
        }
    }

    @observable chapter = 0
    @observable section = 0

    serialize() {
        return this.toString()
    }

    format({ sectionSeparator = '.', skipZeros = true } = {}) {
        if (skipZeros && !this.section) {
            return `${this.chapter}`;
        }
        return `${this.chapter}${sectionSeparator}${this.section || 0}`;
    }

    matches(chapterSection: string | ChapterSection) {
        const [c,s] = String(chapterSection).split('.').map(Number);
        return this.chapter == c && (!s || this.section == s);
    }

    split() {
        return [this.chapter, this.section];
    }

    join(sectionSeparator = '.') {
        return this.format({ sectionSeparator, skipZeros: false });
    }

    toString() {
        return this.key;
    }

    @computed get isEmpty() {
        return !this.isPresent;
    }

    @computed get isPresent() {
        return Boolean(this.chapter || this.section);
    }

    @computed get key() {
        return this.format({ skipZeros: false });
    }

    @computed get asString() {
        return this.format();
    }

    @computed get asNumber() {
        return reduceRight(
            this.asArray,
            (memo:number, num: number, index: number) => memo + (num * Math.pow(100, index + 1)),
        );
    }

    @computed get asArray() {
        return [this.chapter || 0, this.section || 0];
    }

    eq(other: ChapterSection) {
        return Boolean(
            this.chapter == other.chapter &&
                this.section == other.section
        );
    }

}
