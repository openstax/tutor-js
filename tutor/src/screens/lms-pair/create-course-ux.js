import CreateCourseUX from '../new-course/ux';
import Router from './router';
import { computed, action } from 'mobx';

export default
class PairingCreateCourseUX extends CreateCourseUX {

  @computed get selectOfferingTitle() {
        return this.parentUX.stage === 0 ?
            'Which course would you like to use with your LMS?' : 'Which course are you teaching?';
    }

  constructor(ux) {
      super({
          router: new Router(ux),
          courses: ux.courses,
      });
      this.parentUX = ux;
      this.canCancel = false;
  }

  @computed get canGoBackward() {
      return true;
  }

  @action.bound goBackward() {
      if (0 == this.currentStageIndex) {
          this.parentUX.stage = 0;
      } else {
          this._goBackward();
      }
  }

}
