import Map from 'shared/model/map';
import { find } from 'lodash';
import { computed, modelize, ID, hydrateInstance, hydrateModel } from 'shared/model'
import { map, flatten } from 'lodash';
import { Purchase } from '../models'

export class PurchasesMap extends Map<ID, Purchase> {
    static Model = Purchase

    constructor() {
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

    onLoaded({ data: { orders } } : {data: { orders: any[] } } ) {
        orders.forEach((o:Purchase) => {
            const purchase = this.get(o.identifier)
            if(purchase) {
                hydrateInstance(purchase, o, this)
            } else {
                this.set(o.identifier, hydrateModel(Purchase, o, this))
            }
        });    }
}

export const currentPurchases = new PurchasesMap();
