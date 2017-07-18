import Map from './map';
import { find } from 'lodash';
import { computed } from 'mobx';
import Purchase from './purchases/purchase';

class PurchasesMap extends Map {

  @computed get isAnyRefundable() {
    return find(this.array, 'isRefundable');
  }

  bootstrap(data) {
    Purchase.URL.set(data.payments_base_url);
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

export default purchasesMap;
