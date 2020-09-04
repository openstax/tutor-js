import { computed } from 'mobx';
import { fromResource } from 'mobx-utils';
import { debounce } from 'lodash';
import { BREAKPOINTS } from '../theme';

export default class WindowSize {

  constructor({ windowImpl = window } = {}) {
    this.size = fromResource(
      (sink) => {
        sink(this.readSize(windowImpl));
        this.updater = debounce(() => sink(this.readSize(windowImpl)), 200);
        windowImpl.addEventListener('resize', this.updater);
      },
      () => {
        windowImpl.removeEventListener('resize', this.updater);
        this.updater = null;
      }
    );
  }

  @computed get current() {
    return this.size.current();
  }

  @computed get width() {
    return this.current.width;
  }

  @computed get height() {
    return this.current.height;
  }

  @computed get isMobile() {
    return this.current.width <= BREAKPOINTS.mobile;
  }
  
  readSize(windowImpl = window) {
    return {
      width: windowImpl.innerWidth,
      height: windowImpl.innerHeight,
    };
  }

}
