import { BaseAction } from './base';

export default class Reposition extends BaseAction {

    beforeStep() {
        this.$('.card-body').classList.add('on-demo-hover');
    }

    afterStep() {
        this.$('.card-body').classList.remove('on-demo-hover');
    }

}
