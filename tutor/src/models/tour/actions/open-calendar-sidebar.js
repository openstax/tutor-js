import { BaseAction, identifiedBy } from './base';
import { defer } from 'lodash';
import { action, computed } from 'mobx';

@identifiedBy('tour/action/open-calendar-sidebar')
export default class OpenCalendarSidebar extends BaseAction {

  beforeStep() {
    this.wasOpen = this.toggle.classList.contains('open');
    if (!this.wasOpen) {
      this.toggleSidebar();
      // sidebar animates for 500ms
      this.repositionAfter(550);
    }
  }

  afterStep() {
    if (!this.wasOpen) { this.toggleSidebar(); }
  }

  @computed get toggle() {
    return this.document.querySelector('.calendar-header .sidebar-toggle');
  }

  @action.bound
  toggleSidebar() {
    defer(() => {
      this.toggle.click();
    });
  }

}
