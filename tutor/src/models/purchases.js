import Map from 'shared/model/map';
import { find } from 'lodash';
import { computed } from 'mobx';
import { map, flatten } from 'lodash';
import Purchase from './purchases/purchase';

class PurchasesMap extends Map {

  keyType = String

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
