import { BaseAction, identifiedBy } from './base';
import { defer, delay } from 'lodash';
import { action } from 'mobx';

@identifiedBy('tour/action/open-calendar-sidebar')
export default class OpenCalendarSidebar extends BaseAction {

  beforeStep() {
    this.wasOpen = this.el.parentElement.classList.contains('is-open');
    if (!this.wasOpen) {
      this.toggleSidebar();
      // sidebar animates for 500ms
      delay(() => this.ride.joyrideRef.calcPlacement(), 550);
    }
  }

  afterStep() {
    if (!this.wasOpen) { this.toggleSidebar(); }
  }

  @action.bound
  toggleSidebar() {
    defer(() => {
      this.document.querySelector('.calendar-header .sidebar-toggle').click();
    });
  }

}
