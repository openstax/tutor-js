import { invoke, defer } from 'lodash';
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

  @computed get pageClassName() {
    return cn('page', {
      hidden: this.isPageHidden,
    });
  }

  @computed get overlayClassName() {
    return cn('overlay', this.activeOverlay.id);
  }

  @action.bound onOverlayAnimated() {
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
