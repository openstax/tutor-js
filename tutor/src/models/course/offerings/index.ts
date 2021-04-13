import { computed, action } from 'mobx';
import Map, { ID, modelize } from 'shared/model/map';
import Offering from './offering';
import { OfferingObj } from '../../types'

export class OfferingsMap extends Map<ID, Offering> {
    static Model = Offering

    constructor() {
        super();
        modelize(this);
    }

    where(condition: (_course: Offering) => boolean): OfferingsMap {
        return super.where(condition)
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


    @action bootstrap(items: OfferingObj[] ) {
        this.replace(this.arrayToObject(items))
    }

}

const offeringsMap = new OfferingsMap();

export { Offering };

export default offeringsMap;
