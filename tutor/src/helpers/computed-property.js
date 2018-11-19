import { forIn } from 'lodash';
import { computed } from 'mobx';

export function addComputedProperty(obj, name, fn) {

  Object.defineProperty(obj, name, {
    configurable: true,
    get() {
      const me = this;
      Object.defineProperty(this, name, {
        configurable: false,
        get: () => {
          return fn.call(me);
        },
      });
      return fn.call(me);
    },
  });

}

export function extendHasMany(properties) {
  return (collection) => {
    forIn(properties, (fn, prop) => {
      addComputedProperty(collection, prop, fn);
    });
  };
}
