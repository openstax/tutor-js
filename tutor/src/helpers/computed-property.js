import { forIn } from 'lodash';
import { computed } from 'mobx';

export function addComputedProperty(obj, name, fn) {

    Object.defineProperty(obj, name, {
        configurable: true,
        get() {
            const getter = computed(fn, { context: obj });
            Object.defineProperty(obj, name, {
                configurable: false,
                get: () => getter.get(),
            });
            return getter.get();
        },
    });

}

export function getters(properties) {
    return (collection) => {
        forIn(properties, (fn, prop) => {
            addComputedProperty(collection, prop, fn);
        });
    };
}
