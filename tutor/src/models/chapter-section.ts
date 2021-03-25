import { BaseModel, modelize, observable } from 'shared/model';
import { isArray, reduceRight } from 'lodash';
import { computed } from 'mobx';


export default class ChapterSection extends BaseModel {

    constructor(arg: [number, number] | string = '') {
        super();
        modelize(this);
        if (isArray(arg)) {
            [this.chapter, this.section] = arg;
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
            0,
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
