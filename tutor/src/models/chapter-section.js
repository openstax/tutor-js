import {
  BaseModel, identifiedBy, session,
} from './base';

import { computed } from 'mobx';

@identifiedBy('chapter-section')
export default class ChapterSection extends BaseModel {

  constructor([chapter, section]) {
    super();
    this.chapter = chapter;
    this.section = section;
  }

  format({ sectionSeparator = '.', skipZeros = true } = {}) {
    if (skipZeros && this.section === 0) {
      return this.chapter;
    }
    return `${this.chapter}${sectionSeparator}${this.section}`;
  }

  @computed get asString() {
    return this.format();
  }

}
