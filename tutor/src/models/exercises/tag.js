import {
    BaseModel, identifiedBy, identifier, field, computed, session,
} from 'shared/model';
import ChapterSection from '../chapter-section';
import { compact, includes } from 'lodash';

const TAGS = {
    LO: ['lo', 'aplo'],
    GENERIC: ['blooms', 'dok', 'length'],
    IMPORTANT: ['lo', 'aplo', 'blooms', 'dok', 'length', 'time'],
};

@identifiedBy('exercises/tag')
export default class ExerciseTag extends BaseModel {

  @identifier id;
  @field data;
  @field is_visible;
  @field type;
  @field name;
  @field description;
  @session exercise;
  @field({ model: ChapterSection }) chapter_section;

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

  recordInfo(tag) {
      if (this.isDOK) { tag.dok = this; }
      if (this.isLO) { tag.lo = this; }
      if (this.isBlooms) { tag.blooms = this; }
      if (this.chapter_section) {
          tag.chapterSection = this.chapter_section;
      }
      return tag;
  }

}
