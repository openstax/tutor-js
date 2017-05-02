import { ObservableMap, computed } from 'mobx';
import Offering from './offering';

class OfferingsMap extends ObservableMap {

  @computed get array() {
    return this.values();
  }

  onLoaded({ data: { items } }) {
    items.forEach(offering => this.set(offering.id, new Offering(offering)));
  }

}

const offeringsMap = new OfferingsMap();

export default offeringsMap;
