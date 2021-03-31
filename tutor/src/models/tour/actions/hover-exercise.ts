import { BaseAction } from './base';

export default class Reposition extends BaseAction {

    async beforeStep(_options: any) {
        this.$('.card-body')?.classList.add('on-demo-hover');
    }

    async afterStep(_options:any) {
        this.$('.card-body')?.classList.remove('on-demo-hover');
    }

}
