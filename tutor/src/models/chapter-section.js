import {
  BaseModel, identifiedBy, session,
} from 'shared/model';

import { computed } from 'mobx';

@identifiedBy('chapter-section')
export default class ChapterSection extends BaseModel {

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

  @computed get asArray() {
    return [this.chapter, this.section];
  }

}
