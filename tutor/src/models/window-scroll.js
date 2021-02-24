import { computed } from 'mobx';
import { fromResource } from 'mobx-utils';
import { debounce } from 'lodash';

export default class WindowScroll {

    constructor(windowImpl = window) {
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
        );
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
