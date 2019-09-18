import { BaseAction } from './base';
import { action } from 'mobx';
import { delay } from 'lodash';

export default class OpenDowndownMenu extends BaseAction {

  preValidate() {
    // click menu twice to force it to render
    if (!this.isOpen) {
      this.menu.click();
      delay(() => this.menu.click(), 1);
    }
  }

  beforeStep() {
    window.scroll(0,0);
    return this.clickMenu();
  }

  afterStep({ nextStep } = {}) {
    // don't close if the next step's action is targeting
    // the same menu; doing so causes the menu to flicker
    if (nextStep &&
        nextStep.actionInstance &&
        nextStep.actionInstance instanceof this.constructor) {
      return Promise.resolve();
    }
    if (this.isOpen) {
      return this.clickMenu();
    }
    return Promise.resolve();
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
