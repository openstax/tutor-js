import { computed } from 'mobx';
import Map from '../../map';
import Offering from './offering';

class OfferingsMap extends Map {

  onLoaded({ data: { items } }) {
    items.forEach(offering => this.set(offering.id, new Offering(offering)));
  }

  @computed get fetched() {
    if (!this.isFetched && this.fetch){
      this.fetch();
      this.isFetched = true;
    }
    return this;
  }

  @computed get tutor() {
    return this.where(c => !c.is_concept_coach);
  }

}

const offeringsMap = new OfferingsMap();

export default offeringsMap;
