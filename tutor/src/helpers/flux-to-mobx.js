import { fromResource } from 'mobx-utils';

export default function fluxToMobx(store, getter, { event = 'change' } = {}) {
    let listener;

    return fromResource(
        (sink) => {
            listener = () => sink(getter());
            store.on(event, listener);
            sink(getter());
        },
        () => {
            store.off(event, listener);
        }
    );
}
