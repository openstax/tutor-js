import { BaseAction } from './base';
import { defer } from 'lodash';
import { action } from 'mobx';

export default class OpenDowndownMenu extends BaseAction {
  // for unknown reasons the menu always closes after the card is moved
  // therefore it'll aways be closed when the action starts, no need to check isOpen
  beforeStep() {
    this.clickMenu();
    this.repositionAfter(30);
  }

  get isOpen() {
    return $0.getAttribute('aria-expanded') === 'true';
  }

  @action.bound
  clickMenu() {
    defer(() => {
      this.menu.click();
    });
  }
}
