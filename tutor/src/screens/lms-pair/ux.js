import { action, observable, computed, modelize } from 'shared/model'
import LMSPair from '../../models/course/pair-to-lms';
import Courses from '../../models/courses-map';
import NewOrExising from './new-or-existing';
import CreateCourse from './create-course';
import CreateCourseUX from './create-course-ux';
import ExistingCourse from './existing-course';

export default class LmsPairUX {

    @observable stage = 0;
    @observable newOrExisting;
    @observable pairedCourse;
    @observable courses;

    @observable createCourseUX = new CreateCourseUX(this);

    constructor({
        courses = Courses.nonPreview.teaching.currentAndFuture,
    } = {}) {
        modelize(this);
        this.courses = courses.where(c => c.is_access_switchable);
    }

    @computed get panel() {
        if (this.courses.any) {
            if (1 === this.stage) {
                return 'new' === this.newOrExisting ? CreateCourse : ExistingCourse;
            } else {
                return NewOrExising;
            }
        } else {
            return CreateCourse;
        }
    }

    @action.bound onSelectNew() { this.newOrExisting = 'new'; }
    @action.bound onSelectExisting() { this.newOrExisting = 'existing'; }
    @action.bound goBackward() {
        this.stage -= 1;
    }
    @action.bound goForward() {
        if (0 === this.stage) {
            this.stage += 1;
        } else {
            this.startPairing();
        }
    }

    @computed get canGoForward() {
        if (0 === this.stage){
            return Boolean(this.newOrExisting);
        } else {
            return Boolean(this.pairedCourse);
        }
    }

    @action.bound startPairing() {
        this.lmsPair = new LMSPair(this.pairedCourse);
        this.lmsPair.save().then(this.onPaired);
    }

    @action.bound onPaired() {
        if (this.lmsPair.success) {
            window.location = '/courses';
        }
    }

    @computed get props() {
        return { ux: this };
    }

    @action.bound pairCourse(course) {
        this.pairedCourse = course;
    }

}
