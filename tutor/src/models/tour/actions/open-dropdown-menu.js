import { BaseAction } from './base';
import { defer } from 'lodash';
import { action } from 'mobx';

export default class OpenDowndownMenu extends BaseAction {
  // for unknown reasons the menu always closes after the card is moved
  // therefore it'll aways be closed when the action starts, no need to check isOpen
  beforeStep() {
    window.scroll(0,0);
    this.clickMenu();
    this.repositionAfter(90);
  }

  get isOpen() {
    return this.menu.parentElement.classList.contains('show');
  }

  @action.bound
  clickMenu() {
    defer(() => {
      this.menu.click();
    });
  }
}
