import { filter, find } from 'lodash';
import { action } from 'mobx';

const TagAssociation = {
  withType: function(type, { multiple = false } = {}) {
    return multiple ? filter(this, { type }) : find(this, { type });
  },

  findOrAddWithType: action(function(type) {
    return this.withType(type) || this.get(this.push(`${type}:`) - 1);
  }),

  replaceType: action(function(type, tags) {
    this.withType(type, { multiple: true }).forEach(t => this.remove(t));
    tags.forEach((tag) => {
      this.push({ type: type, value: tag.value });
    });
  }),

  removeType: action(function(type) {
    const tag = this.withType(type);
    this.remove(tag);
  }),

  setUniqueValue: action(function(tag, value) {
    const existing = find(this, { type: tag.type, value: value });
    if (existing) {
      this.remove(tag);
    }
    tag.value = value;
  }),

  includes({ type, value }) {
    return Boolean(find(this, { type, value }));
  },
};


export default TagAssociation;
