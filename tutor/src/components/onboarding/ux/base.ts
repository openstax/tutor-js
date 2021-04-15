import { observable, computed, modelize } from 'shared/model'
import type { Course, TourContext } from '../../../models'

const SPY_MODE = observable.box(false);

export class BaseOnboarding {

    @observable course: Course;
    @observable tourContext: TourContext;
    @observable isDismissed = false;
    @observable otherModalsAreDisplaying = false

    priority = 3;

    static set spyMode(v: any) {
        SPY_MODE.set(v);
    }

    constructor(course: Course, tourContext: TourContext) {
        modelize(this);
        this.course = course;
        this.tourContext = tourContext;
        this.isDismissed = false;
    }

    // overridden by subclasses
    @computed get nagComponent(): any { return null; }

    @computed get isReady() {
        return !this.isDismissed && this.nagComponent;
    }

    @computed get courseIsNaggable() {
        return SPY_MODE.get() || (this.course.isActive && this.course.primaryRole.joinedAgo('hours') > 4)
    }

    mount() { }
    close() { }
}
