import {
  BaseModel, identifiedBy,
} from 'shared/model';

import { computed } from 'mobx';

export default
@identifiedBy('chapter-section')
class ChapterSection extends BaseModel {

  constructor([chapter, section]) {
    super();
    this.chapter = chapter;
    this.section = section;
  }

  format({ sectionSeparator = '.', skipZeros = true } = {}) {
    if (skipZeros && !this.section) {
      return `${this.chapter}`;
    }
    return `${this.chapter}${sectionSeparator}${this.section}`;
  }

  @computed get asString() {
    return this.format();
  }

  toString() {
    return this.format();
  }

  @computed get asArray() {
    return [this.chapter, this.section];
  }

};
