import { BaseAction, identifiedBy } from './base';
import { delay } from 'lodash';
import { action, computed } from 'mobx';

export default
@identifiedBy('tour/action/open-calendar-sidebar')
class OpenCalendarSidebar extends BaseAction {

  beforeStep() {
    this.wasOpen = this.toggle.classList.contains('open');
    if (!this.wasOpen) {
      return this.toggleSidebar();
      // sidebar animates for 500ms + a bit longer
    }
    return Promise.resolve();
  }

  afterStep() {
    if (!this.wasOpen) {
      return this.toggleSidebar();
    }
    return Promise.resolve();
  }

  @computed get toggle() {
    return this.document.querySelector('.calendar-header .sidebar-toggle');
  }

  @action.bound
  toggleSidebar() {
    return new Promise((resolve) => {
      delay(() => this.toggle.click(), 5);
      delay(() => resolve(), 500);
    });
  }

}
