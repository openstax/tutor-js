import React from 'react';
import { Redirect } from 'react-router-dom';
import { computed, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import User from '../../models/user';
import Router from '../../helpers/router';
import Courses from '../../models/courses-map';
import EmptyCourses from './empty';
import TourRegion from '../tours/region';
import PendingVerification from './pending-verification';
import TourContext from '../../models/tour/context';
import { includes } from 'lodash';

import { MyCoursesPast, MyCoursesCurrent, MyCoursesPreview } from './listings';

@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
export default class MyCourses extends React.PureComponent {

  static propTypes = {
    tourContext: React.PropTypes.instanceOf(TourContext),
  }

  @computed get stubbornTour() {
    return this.props.tourContext.eligibleTours.find((tour) => (
        includes([
          'explore-a-preview',
          'create-a-course',
        ], tour.id)
      ));
  }

  componentWillMount() {
    User.logEvent({ category: 'onboarding', code: 'arrived_my_courses' });
  }

  componentWillReceiveProps(nextProps) {
    this.forceTours();
  }

  @action.bound
  forceTours() {
    if (!this.props.tourContext.tour) {
      const { stubbornTour } = this;

      if (stubbornTour) {
        stubbornTour.isEnabled = true;
      }
    }
  }

  @computed get firstCourse() {
    return Courses.array[0];
  }

  @computed get shouldRedirect() {
    if (Courses.size !== 1){
      return false;
    }
    return (
      this.firstCourse.isStudent && this.firstCourse.isActive
    );
  }

  render() {
    if (!Courses.size && !User.isConfirmedFaculty) {
      if (User.isUnverifiedInstructor) { return <PendingVerification />; }
      return <EmptyCourses />;
    }

    if (this.shouldRedirect) {
      return (
        <Redirect to={Router.makePathname('dashboard', { courseId: this.firstCourse.id })} />
      );
    }

    return (
      <TourRegion
        id="my-courses"
        otherTours={[
          'my-courses-coach-migrate',
          'my-courses-coach-no-migrate',
          'explore-a-preview',
          'create-a-course',
        ]}
        className="my-courses"
      >
        <MyCoursesCurrent />
        <MyCoursesPreview />
        <MyCoursesPast    />
      </TourRegion>
    );
  }

}
