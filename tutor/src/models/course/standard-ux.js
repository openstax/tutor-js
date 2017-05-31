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
    return {
      some_credit: 'Required for some course credit',
      extra_credit: 'For extra credit',
      additional_resource: 'As an additional resource',
      dont_know: 'I don’t know yet',
      wont_use: 'I won’t be using it',
    };
  }


}
