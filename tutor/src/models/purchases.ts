import Map from 'shared/model/map';
import { find } from 'lodash';
import { computed, modelize } from 'shared/model'
import { map, flatten } from 'lodash';
import Purchase from './purchases/purchase';

class PurchasesMap extends Map {
    keyType = String

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get isAnyRefundable() {
        return find(this.array, 'isRefundable');
    }

    @computed get withRefunds() {
        return flatten(map(this.array, (purchase) =>
            purchase.is_refunded ? [ purchase, purchase.refundRecord ] : [ purchase ],
        )).reverse();
    }


    // called by API
    fetch() {}
    onLoaded({ data: { orders } }) {
        const ordersById = {};
        orders.forEach(o => ordersById[o.identifier] = new Purchase(o));
        this.replace(ordersById);
    }
}

const purchasesMap = new PurchasesMap();
export { PurchasesMap, Purchase };
export default purchasesMap;
