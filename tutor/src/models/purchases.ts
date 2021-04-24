import Map from 'shared/model/map';
import { find } from 'lodash';
import { computed, modelize, ID } from 'shared/model'
import { map, flatten } from 'lodash';
import { Purchase } from '../models'
import type { PurchaseData } from '../models'
import urlFor from '../api';

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

    async fetch() {
        const data = await this.api.request<{ orders: PurchaseData[] }>(urlFor('fetchPaymentHistory'))
        this.mergeModelData(data.orders)
    }
}

export const currentPurchases = new PurchasesMap();
