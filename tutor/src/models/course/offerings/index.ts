import { computed, action } from 'mobx';
import Map, { ID, modelize } from 'shared/model/map';
import Offering from './offering';

class OfferingsMap extends Map<ID, Offering> {
    constructor() {
        super();
        modelize(this);
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

    @action bootstrap(items: any) {
        this.replace(items)
    }

}

const offeringsMap = new OfferingsMap();

export { Offering, OfferingsMap };

export default offeringsMap;
