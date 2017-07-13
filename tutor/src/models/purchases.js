import Map from './map';

import {
  BaseModel, identifiedBy, field, identifier, session,
} from './base';

const STUB_DATA = require('../../api/purchases.json');

@identifiedBy('purchase')
export class Purchase extends BaseModel {

  @identifier uuid;
  @field product_name;
  @field({ type: 'date' }) occured_at;
  @field order_number;
  @field amount;

  @session can_refund;
}

class PurchasesMap extends Map {
  fetch() {
    this.apiRequestsInProgress.set('fetch', true);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.clear();
        STUB_DATA.forEach((row) => this.set(row.uuid, new Purchase(row)));
        this.apiRequestsInProgress.delete('fetch');
        resolve(this);
      }, 1500);
    });
  }
}

const purchasesMap = new PurchasesMap();

export default purchasesMap;
