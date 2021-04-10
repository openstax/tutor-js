import { BaseAction } from './base';
import { action, modelize } from 'shared/model'
import { delay } from 'lodash';

export default class OpenDowndownMenu extends BaseAction {
    constructor() {
        super();
        modelize(this);
    }

    get menu(): HTMLDivElement | null {
        return null
    }

    preValidate() {
    // click menu twice to force it to render
        if (this.menu && !this.isRendered) {
            this.menu.click();
            delay(() => this.menu?.click(), 1);
        }
    }

    async beforeStep(_options: any) {
        window.scroll(0,0);
        if (this.isOpen) {
            return Promise.resolve();
        }
        return this.clickMenu();
    }

    async afterStep({ nextStep }: { nextStep?:any } = {}) {
    // don't close if the next step's action is targeting
    // the same menu; doing so causes the menu to flicker
        if (this.menu &&
        nextStep &&
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
        return Boolean(
            this.menu && this.menu?.parentElement?.classList.contains('show')
        );
    }

    get isRendered() {
        return Boolean(
            this.menu &&
                this.menu?.parentElement?.querySelector('.dropdown-item')
        );
    }

    @action.bound clickMenu(): Promise<void> {
        if (!this.menu) { return Promise.resolve(); }
        return new Promise((resolve) => {
            delay(() => this.menu?.click(), 5);
            delay(() => resolve(), 50);
        });
    }
}
