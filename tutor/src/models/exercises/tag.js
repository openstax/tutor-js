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

export default
@identifiedBy('exercises/tag')
class ExerciseTag extends BaseModel {

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

  @computed get isGeneric() {
    return includes(TAGS.GENERIC, this.type);
  }

  @computed get asString() {
    const str = compact([this.name, this.description]).join(' ');
    return str || String(this.id);
  }

  recordInfo(tag) {
    if (this.isGeneric) { tag.tagString.push(this.asString); }
    if (this.isLO) { tag.lo = this.asString; }
    if (this.chapter_section) {
      tag.section = this.chapter_section.asString;
    }
    return tag;
  }

}
