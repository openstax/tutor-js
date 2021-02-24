import { computed } from 'mobx';
import Map from 'shared/model/map';
import Offering from './offering';

class OfferingsMap extends Map {

    onLoaded({ data: { items } }) {
        items.forEach(offering => this.set(offering.id, new Offering(offering)));
    }

    get fetched() {
        if (!this.isFetched && this.fetch){
            this.fetch();
            this.isFetched = true;
        }
        return this;
    }

    @computed get tutor() {
        return this.where(c => !c.is_concept_coach);
    }

    @computed get previewable() {
        return this.where(c => c.is_preview_available);
    }

    @computed get available() {
        return this.where(c => c.is_available && !c.is_concept_coach);
    }

    @computed get biology2e() {
        return this.available.where(c => c.appearance_code == 'biology_2e');
    }

    // will be overwritten by API
    fetch() {}

}

const offeringsMap = new OfferingsMap();

export { Offering, OfferingsMap };

export default offeringsMap;
