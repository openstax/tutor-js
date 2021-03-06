import { BaseModel, modelize, field, array, computed, NEW_ID, ID } from 'shared/model';

// TourRegion
// Wraps an area of the screen, maps it's id to a given set of audience tags

export class TourRegion extends BaseModel {

    @field id: string = ''
    @field courseId: ID = NEW_ID;

    @field otherTours = array<string>()

    constructor() {
        super();
        modelize(this);
    }

    @computed get tour_ids() {
        // this seems convoluted, but this makes it so that `tour_ids` will react
        // to `otherTours` updates.  see https://github.com/openstax/tutor-js/pull/1726#discussion_r122459935
        // for more details.
        return this.otherTours.slice().reverse().concat( [this.id] ).reverse();
    }

    @computed get target() {
        return `[data-tour-region-id="${this.id}"]`;
    }

    get element() {
        return document.querySelector(this.target);
    }


}
