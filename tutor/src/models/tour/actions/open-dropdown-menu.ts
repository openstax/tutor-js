import { BaseAction } from './base';
import { action, modelize } from 'shared/model'
import { delay } from 'lodash';

export default class OpenDowndownMenu extends BaseAction {
    constructor(options: any = {}) {
        super(options);
        modelize(this);
    }

    get menu(): HTMLDivElement | null {
        return null
    }

    preValidate() {
    // click menu twice to force it into the DOM
        if (this.menu && !this.isRendered) {
            this.menu.click();
            delay(() => this.menu?.click(), 1);
        }
        // Start with the tooltip closed
        this.step.tooltipOpen = false;
    }

    async beforeStep(_options: any) {
        // If possible scroll to the top immediately
        window.scroll(0,0)
        // Some pages have a scroll down animation so we gotta wait for them before going back up
        delay(() => window.scroll(0,0), 250)
        if (!this.menu) { return; }
        // Open the menu after the modal renders and blocks clicks, if not already open
        delay(async () => this.openMenu(), 0)
        // Open the tooltip after a delay so it gets the correct menu position
        delay(async () => this.openTooltip(), 350)
        // Try to open the menu immediately
        return this.openMenu();
    }

    async afterStep({ nextStep }: { nextStep?:any } = {}) {
    // don't close if the next step's action is targeting
    // the same menu; doing so causes the menu to flicker
        if (
            !this.menu || (
                nextStep &&
                nextStep.actionInstance &&
                nextStep.actionInstance instanceof this.constructor
            )
        ) { return; }
        if (this.isOpen) { return this.clickMenu() }
    }

    get isOpen() {
        return Boolean(
            this.menu && this.menu.parentElement?.classList.contains('show')
        );
    }

    get isRendered() {
        return Boolean(
            this.menu && this.menu.parentElement?.querySelector('.dropdown-item')
        );
    }

    async openMenu() {
        if (!this.menu || this.isOpen) { return; }
        return this.clickMenu();
    }

    @action.bound clickMenu(): Promise<void> {
        if (!this.menu) { return Promise.resolve(); }
        return new Promise((resolve) => {
            this.menu?.click();
            resolve();
        });
    }

    @action.bound openTooltip(): Promise<void> {
        if (!this.step) { return Promise.resolve(); }
        return new Promise((resolve) => {
            this.step.tooltipOpen = true;
            resolve();
        });
    }
}
