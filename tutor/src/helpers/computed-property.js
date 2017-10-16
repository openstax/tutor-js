import { forIn } from 'lodash';
import { computed } from 'mobx';

export function addComputedProperty(obj, name, fn) {

  Object.defineProperty(obj, name, {
    configurable: true,
    get() {
      const getter = computed(fn, { context: this });
      Object.defineProperty(this, name, {
        configurable: false,
        get: () => getter.get(),
      });
      return getter.get();
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
