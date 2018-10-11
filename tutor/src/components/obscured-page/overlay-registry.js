import { observable, action, computed } from 'mobx';
import cn from 'classnames';

export class OverlayRegistry {

  @observable overlays = new Map();
  @observable _overlay;
  @observable page;
  @observable detached;

  attachPage() {
    this.detached.parent.insertBefore(this.page, this.detached.sibling);
    this.detached = null;
  }

  detachPage() {
    this.detached = {
      parent: this.page.parentElement,
      sibling: this.page.nextSibling,
    };
    this.detached.parent.removeChild(this.page);
  }

  @action closePage() {
    this.page = null;
  }

  renderPage(el) {
    this.page = el;
  }

  @action hideOverlay() {
    this._overlay = null;
  }

  @computed get pageClassName() {
    return cn('page', {
      hidden: this.overlay,
    });
  }

  @computed get overlayClassName() {
    return cn('overlay', {
      visible: this.overlay,
    });
  }

  @action setOverlay({ id, renderer }) {
    this._overlay = { id, renderer };
  }

  get overlay() {
    return (this._overlay && this._overlay.renderer()) || null;
  }

}

const DefaultRegistry = new OverlayRegistry();

export { DefaultRegistry };
