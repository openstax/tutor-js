import { BaseModel, field, computed, getParentOf } from 'shared/model';
import ChapterSection from '../chapter-section';
import { compact, includes } from 'lodash';
import type Exercise from './exercise'

const TAGS = {
    LO: ['lo', 'aplo'],
    GENERIC: ['blooms', 'dok', 'length'],
    IMPORTANT: ['lo', 'aplo', 'blooms', 'dok', 'length', 'time'],
};

export interface ImportantTags {
    lo?: ExerciseTag
    dok?: ExerciseTag
    blooms?: ExerciseTag
    chapterSection?: ChapterSection
}


export default class ExerciseTag extends BaseModel {

    @field id = ''
    @field data = '';
    @field is_visible = false;
    @field type = '';
    @field name = '';
    @field description = '';

    get exercise() { return getParentOf<Exercise>(this) }

    @field({ model: ChapterSection }) chapter_section = ChapterSection.blank;

    @computed get isImportant() {
        return includes(TAGS.IMPORTANT, this.type);
    }

    @computed get isLO() {
        return includes(TAGS.LO, this.type);
    }

    @computed get isBlooms() {
        return this.type == 'blooms';
    }

    @computed get isDOK() {
        return this.type == 'dok';
    }

    @computed get isGeneric() {
        return includes(TAGS.GENERIC, this.type);
    }

    @computed get asString() {
        const str = compact([this.name, this.description]).join(' ');
        return str || String(this.id);
    }

    @computed get value() {
        return this.id.replace(/(\w+:\s*)/, '');
    }

    recordInfo(tag: ImportantTags) {
        if (this.isDOK) { tag.dok = this; }
        if (this.isLO) { tag.lo = this; }
        if (this.isBlooms) { tag.blooms = this; }
        if (this.chapter_section) {
            tag.chapterSection = this.chapter_section;
        }
        return tag;
    }

}
