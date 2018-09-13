import { mapValues, reduce, map, filter, find, inRange, merge } from 'lodash';
import { action } from 'mobx';

const TagAssociation = {
  withType: function(type, { multiple = false } = {}) {
    return multiple ? filter(this, { type }) : find(this, { type });
  },

  findOrAddWithType: action(function(type) {
    return this.withType(type) || this.get(this.push(`${type}:`) - 1);
  }),

  setUniqueValue: action(function(tag, value) {
    const existing = find(this, { type: tag.type, value: value });
    if (existing) {
      this.remove(tag);
    }
    tag.value = value;
  }),
};


export default TagAssociation;
