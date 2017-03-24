import { BaseAction, identifiedBy } from './base';
import { defer } from 'lodash';
import { action } from 'mobx';

@identifiedBy('tour/action/open-user-menu')
export default class OpenUserMenu extends BaseAction {

  // for unknown reasons the menu always closes after the card is moved
  // therefore it'll aways be closed when the action starts, no need to check isOpen
  beforeStep() {
    this.clickMenu();
    this.repositionAfter(30);
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
