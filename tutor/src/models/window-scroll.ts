import { computed, modelize } from 'shared/model'
import { fromResource } from 'mobx-utils';
import { debounce } from 'lodash';

export class WindowScroll {

    position: {
        current: () => { x: number, y: number }
    }
    updater: any

    constructor(windowImpl = window) {
        modelize(this);
        this.position = fromResource(
            (sink) => {
                sink(this.readPosition(windowImpl));
                this.updater = debounce(() => sink(this.readPosition(windowImpl)), 200);
                windowImpl.addEventListener('scroll', this.updater);
            },
            () => {
                windowImpl.removeEventListener('scroll', this.updater);
                this.updater = null;
            }
        ) as any
    }

    @computed get current() {
        return this.position.current();
    }

    @computed get x() {
        return this.current.x;
    }

    @computed get y() {
        return this.current.y;
    }

    readPosition(windowImpl = window) {
        return {
            x: windowImpl.scrollX,
            y: windowImpl.scrollY,
        };
    }

}
