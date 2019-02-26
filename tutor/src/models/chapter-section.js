import { BaseModel, identifiedBy } from 'shared/model';
import { isArray } from 'lodash';
import { computed } from 'mobx';

export default
@identifiedBy('chapter-section')
class ChapterSection extends BaseModel {

  constructor(arg = []) {
    super();
    if (isArray(arg)) {
      [this.chapter, this.section] = arg
    } else {
      [this.chapter, this.section] = arg.split('.')
    }
  }

  format({ sectionSeparator = '.', skipZeros = true } = {}) {
    if (skipZeros && !this.section) {
      return `${this.chapter}`;
    }
    return `${this.chapter}${sectionSeparator}${this.section || 0}`;
  }

  matches(chapterSection) {
    const [c,s] = String(chapterSection).split('.');
    return this.chapter == c && (!s || this.section == s);
  }

  split() {
    return [this.chapter, this.section];
  }

  join(sectionSeparator = '.') {
    return this.format({ sectionSeparator, skipZeros: false });
  }

  @computed get isEmpty() {
    return !this.chapter && !this.section;
  }

  @computed get asString() {
    return this.format();
  }

  @computed get key() {
    return this.format({ skipZeros: false });
  }

  toString() {
    return this.key;
  }

  @computed get asArray() {
    return [this.chapter, this.section];
  }

};
