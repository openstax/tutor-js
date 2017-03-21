import { BaseAction, identifiedBy } from './base';
import { defer } from 'lodash';
import { action } from 'mobx';

@identifiedBy('tour/action/open-user-menu')
export default class OpenUserMenu extends BaseAction {

  beforeStep() {
    if (!this.isOpen) {
      this.clickMenu();
      this.repositionAfter(30);
    }
  }

  get isOpen() {
    return !!this.menu.classList.contains('open');
  }

  get menu() {
    return document.querySelector('.user-actions-menu');
  }

  @action.bound
  clickMenu() {
    defer(() => {
      this.menu.querySelector('#navbar-dropdown').click();
    });
  }

}
