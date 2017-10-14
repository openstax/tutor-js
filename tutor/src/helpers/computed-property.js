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
