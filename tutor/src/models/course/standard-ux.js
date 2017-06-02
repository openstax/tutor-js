import {
  computed, observable,
} from 'mobx';

import BasicCourseUX from './basic-ux';
import Nags from '../../components/onboarding/nags';

export default class StandardCourseUX extends BasicCourseUX {


  @computed get nagComponent() {
    return Nags.freshlyCreatedCourse;


    if (this.course.dashboardViewCount == 1) {
      return Nags.freshlyCreatedCourse;
    }
  }

  recordExpectedUse(id) {
    console.log(`LOG CHOICE ${id}`);

  }

  get usageOptions() {
    // NOTE - the key's below are meaningful and MUST match what's expected by the BE
    return {
      'For course credit': 'Required for some course credit',
      'For extra credit': 'For extra credit',
      'As an additional resource': 'As an additional resource',
      'I don\'t know yet': 'I don’t know yet',
      'I won\'t be using it': 'I won’t be using it',
    };
  }


}
