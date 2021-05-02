import CreateCourseUX from '../new-course/ux';
import Router from './router';
import { override, modelize } from 'shared/model';

export default
class PairingCreateCourseUX extends CreateCourseUX {

    constructor(ux) {
        super({
            router: new Router(ux),
            courses: ux.courses,
        });
        modelize(this);
        this.parentUX = ux;
        this.canCancel = false;
    }

    get selectOfferingTitle() {
        return this.parentUX.stage === 0 ?
            'Which course would you like to use with your LMS?' : 'Which course are you teaching?';
    }

    @override get canGoBackward() {
        return true;
    }

    @override goBackward() {
        if (0 == this.currentStageIndex) {
            this.parentUX.stage = 0;
        } else {
            this._goBackward();
        }
    }

}
