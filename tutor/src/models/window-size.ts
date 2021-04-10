import { computed, modelize } from 'shared/model'
import { fromResource } from 'mobx-utils';
import { debounce } from 'lodash';
import { BREAKPOINTS } from '../theme';

export default class WindowSize {

    size: {
        current: () => { width: number, height: number }
    }

    updater: any

    constructor({ windowImpl = window } = {}) {
        modelize(this);
        this.size = fromResource(
            (sink) => {
                sink(this.readSize(windowImpl));
                this.updater = debounce(() => sink(this.readSize(windowImpl)), 200);
                windowImpl.addEventListener('resize', this.updater);
            },
            () => {
                windowImpl.removeEventListener('resize', this.updater);
                this.updater = null;
            },
            this.readSize(windowImpl)
        ) as any;
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

    @computed get isTablet() {
        return !this.isMobile && this.current.width <= BREAKPOINTS.tablet;
    }

    @computed get isDesktop() {
        return this.current.width >= BREAKPOINTS.desktop;
    }

    @computed get currentBreakpoint() {
        if (this.isMobile) { return 'mobile'; }
        if (this.isTablet) { return 'tablet'; }
        return 'desktop';
    }

    readSize(windowImpl = window) {
        return {
            width: windowImpl.innerWidth,
            height: windowImpl.innerHeight,
        };
    }

}
