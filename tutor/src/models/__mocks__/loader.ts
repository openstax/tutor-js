/* global jest */
import { delay } from 'lodash';

const Loader = jest.genMockFromModule('../loader').default;
Loader.fetch = jest.fn(function() {
    this.isBusy = true;
    return new Promise((resolve) => {
        delay(() => {
            this.isBusy = false;
            resolve(this);
        });
    });
});

Loader.prototype.isBusy = false;

export default Loader;
