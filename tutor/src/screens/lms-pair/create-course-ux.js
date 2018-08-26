import CreateCourseUX from '../new-course/ux';
import Router from './router';
import { when, observable, computed, action, observe } from 'mobx';

export default class PairingCreateCourseUX extends CreateCourseUX {

  constructor(ux) {
    super(new Router(ux));
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
