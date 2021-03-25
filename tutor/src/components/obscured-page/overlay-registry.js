import { invoke, defer, pick } from 'lodash';
import { observable, action, computed } from 'mobx';
import cn from 'classnames';
import Analytics from '../../helpers/analytics';

export class OverlayRegistry {
    @observable activeOverlay = {};
    @observable page;
    @observable detached;
    @observable isOverlayExpanded = false;
    @observable isOverlayHidden = true;
    @observable isPageHidden = false;
    @observable pageScrollPosition;

    constructor() {
        modelize(this);
    }

    @computed get pageClassName() {
        return cn('page', {
            hidden: this.isPageHidden,
        });
    }

    @computed get overlayClassName() {
        return cn('overlay', this.activeOverlay.id);
    }

    @action.bound onOverlayAnimated() {
        if (this.isOverlayExpanded) {
            this.pageScrollPosition = { x: window.pageXOffset, y: window.pageYOffset };
        }
        this.isPageHidden = this.isOverlayExpanded;
        if (!this.isOverlayExpanded) {
            this.isOverlayHidden = true;
        }
    }

    @action hideOverlay() {
        if (this.isOverlayExpanded) {
            this.onHide();
        }
        this.isPageHidden = false;
        const pos = pick(this.pageScrollPosition, 'x', 'y');
        if  (pos.x || pos.y) {
            defer(() => { // schedule a scroll to take place after the page is re-displayed
                window.scroll(pos.x, pos.y);
            });
            this.pageScrollPosition = null;
        }
        this.isOverlayExpanded = false;
    }

    @action.bound onEscKey() {
        this.hideOverlay();
    }

    @action onHide() {
        invoke(this.activeOverlay, 'onHide');
    }

    @action expandOverlay() {
        this.isOverlayHidden = false;
        defer(() => this.isOverlayExpanded = true);
    }

    @action setOverlay({ visible, id, renderer, onHide }) {
        if (visible) {
            if (id !== this.activeOverlay.id) {
                this.onHide();
            }
            this.activeOverlay = { id, renderer, onHide };
            this.expandOverlay();
            Analytics.sendPageView(`/overlay/${id}`);
        } else if (id == this.activeOverlay.id) {
            this.hideOverlay();
        }
    }

    get overlay() {
        if (this.activeOverlay.renderer) {
            return this.activeOverlay.renderer();
        }
        return null;
    }
}

const DefaultRegistry = new OverlayRegistry();

export { DefaultRegistry };
