import { BaseAction } from './base';
import { action } from 'mobx';
import { delay } from 'lodash';

export default class OpenDowndownMenu extends BaseAction {
  // for unknown reasons the menu always closes after the card is moved
  // therefore it'll aways be closed when the action starts, no need to check isOpen
  beforeStep() {
    window.scroll(0,0);
    if (this.isOpen) {
      return Promise.resolve();
    }
    return this.clickMenu();
  }

  get isOpen() {
    return this.menu.parentElement.classList.contains('show');
  }

  @action.bound clickMenu() {
    return new Promise((resolve) => {
      delay(() => this.menu.click(), 5);
      delay(() => resolve(), 50);
    });
  }
}
