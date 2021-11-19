import { BaseAction } from './base';
import { delay } from 'lodash';
import { action, computed, modelize } from 'shared/model'

export default class OpenCalendarSidebar extends BaseAction {
    constructor(options: any = {}) {
        super(options);
        modelize(this);
    }

    wasOpen = false

    async beforeStep() {
        this.wasOpen = this.toggle?.classList.contains('open') || false
        if (!this.wasOpen) {
            return this.toggleSidebar();
            // sidebar animates for 500ms + a bit longer
        }
        return Promise.resolve();
    }

    async afterStep() {
        if (!this.wasOpen) {
            return this.toggleSidebar();
        }
        return Promise.resolve();
    }

    @computed get toggle() {
        return this.document?.querySelector<HTMLAnchorElement>('.calendar-header .sidebar-toggle');
    }

    @action.bound async toggleSidebar(): Promise<void> {
        return new Promise((resolve) => {
            delay(() => this.toggle?.click(), 5);
            delay(() => resolve(), 500);
        });
    }
}
