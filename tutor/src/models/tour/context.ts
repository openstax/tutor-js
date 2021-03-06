import { BaseModel, computed, observable, field, modelize, ID } from 'shared/model';
import {
    find, isEmpty, intersection, compact, uniq, flatMap, map, get, delay, forEach, flatten, first,
} from 'lodash';
import { action, observe } from 'mobx';
import { currentCourses, currentUser, Tour, TourRide, TourRegion } from '../../models'

// TourContext
// Created by the upper-most React element (the Conductor)
// Regions and Anchors check in and out as they're mounted/unmounted

interface Modal {
    isDisplaying?: boolean
}

export class TourContext extends BaseModel {

    @observable regions = observable.array<TourRegion>([], { deep: false });
    @observable anchors = observable.map<ID, HTMLElement>({}, { deep: false });

    @field isEnabled = true;

    @field emitDebugInfo = false;

    @field autoRemind = true;

    @observable forcePastToursIndication = false;

    @field foo = 1
    @observable otherModal?: Modal

    @observable tourRide: TourRide | null = null;

    constructor() {
        super();
        modelize(this);
        this.pickTourRide();
        observe(this, 'tour', this.pickTourRide);
    }

    @computed get tourIds() {
        if (this.isEnabled && !get(this, 'otherModal.isDisplaying', false)) {
            return compact(uniq(flatMap(this.regions, r => r.tour_ids)));
        } else {
            return [];
        }
    }

    @computed get courseIds() {
        return compact(uniq(map(this.regions, 'courseId')));
    }

    @computed get courses() {
        return compact(this.courseIds.map(id => currentCourses.get(id)));
    }

    @action addAnchor(id: string, domEl: HTMLElement) {
        this.anchors.set(id, domEl);
        this.pickTourRide();
    }

    @action removeAnchor(id: string) {
        this.anchors.delete(id);
        this.pickTourRide();
    }

    @action openRegion(region: TourRegion) {
        const existing = find(this.regions, { id: region.id });
        if (!existing) {
            this.regions.push(region);
            this.checkReminders(region);
        }
        this.pickTourRide();
    }

    @action closeRegion(region: TourRegion) {
        forEach(this.allTours, (tour) => {
            tour.justViewed = false;
        });
        this.regions.remove(region);
        this.pickTourRide();
    }

    @action checkReminders(region: TourRegion) {
        const checkRegion = region || first(this.regions);
        const remindersTourId = 'page-tips-reminders';
        if (checkRegion && this.autoRemind && !this.tour &&
            this.needsPageTipsReminders && !this.tourIds.includes(remindersTourId)
        ) {
            delay(action(() => checkRegion.otherTours?.push(remindersTourId)), 500);
        }
    }

    @computed get activeRegion() {
        if (!this.tour) { return null; }
        return this.regions.find(region => region.tour_ids.find(tid => tid === this.tour.id));
    }

    // terms agreements are allowed to interrupt tours
    @computed get isReady() {
        return !!((isEmpty(this.courses) || !currentUser.terms.areSignaturesNeeded) && this.tour);
    }

    // The tour that should be shown
    @computed get tour() {
        return find(this.eligibleTours, 'isViewable') || null;
    }

    @action.bound pickTourRide() {
        const { tour } = this;
        if (this.tourRide && this.tourRide.tour === tour) { return; }
        this.tourRide = tour ? new TourRide({ tour, context: this, region: this.activeRegion! }) : null;
    }

    @computed get audienceTags() {
        if (isEmpty(this.courses)) {
            return currentUser.tourAudienceTags;
        }
        return uniq(flatMap(this.courses, c => c.tourAudienceTags));
    }

    @computed get toursTags() {
        return flatMap(this.allTours, t => t.audience_tags);
    }

    @computed get allTours() {
        return compact(uniq(
            flatten(this.tourIds.map(id =>
                this.courseIds.map(courseId => Tour.forIdentifier(id, { courseId }))
            )).concat(
                this.tourIds.map(id => Tour.forIdentifier(id, {}))
            )
        ));
    }

    // eligible if tags match and some step is visible
    // deliberatly not @computed so dom changes affect
    get eligibleTours() {
        return this.allTours.filter(tour => (
            !isEmpty(intersection(tour.audience_tags, this.audienceTags)) &&
            find(tour.steps, 'isViewable')
        ));
    }

    @computed get needsPageTipsReminders() {
        return this.hasTriggeredTour && !find(this.eligibleTours, (tour) => tour.autoplay && !tour.perCourse);
    }

    @computed get hasTriggeredTour() {
        return !!find(this.allTours, (tour) =>
            !(tour.autoplay || isEmpty(intersection(tour.audience_tags, this.audienceTags)))
        );
    }

    @computed get debugStatus() {
        return `available regions: [${map(this.regions, 'id')}]; region tour ids: [${this.tourIds}]; audience tags: [${this.audienceTags}]; tour tags: [${this.toursTags}]; eligible tours: [${map(this.eligibleTours, 'id')}]; TOUR RIDE: ${this.tourRide ? this.tourRide.tour.id : '<none>'}`;
    }

    @action playTriggeredTours(options: { except?: boolean } = {}) {
        this.eligibleTours.forEach((tour) => {
            if (!tour.autoplay && tour.id != options.except) {
                tour.play();
            }
        });
        this.pickTourRide();
    }

    @action onTourComplete({ exitedEarly = false } = {}) {
        this.tourRide?.tour.markViewed({ exitedEarly });
        this.pickTourRide();
    }

}
