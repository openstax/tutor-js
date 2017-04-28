import React from 'react';
import { observer } from 'mobx-react';

// import { NewCourseActions, NewCourseStore } from '../../flux/new-course';

import Router from '../../helpers/router';

@observer
export default class BuildCourse extends React.PureComponent {

  static title = 'Creating your new course';
  static Footer() {
      return <span />;
  }
  static contextTypes = {
    router: React.PropTypes.object,
  }

  // componentWillMount() {
  //   NewCourseActions.save()
  // }


  // bindStore: NewCourseStore,
  // bindEvent: 'created',
  // bindUpdate() {
  //   const newCourse = NewCourseStore.newCourse();
  //   if (newCourse) { return this.redirectToCourse(newCourse); }
  // },

  redirectToCourse(course) {
    const to = course.is_concept_coach ? 'ccDashboardHelp' : 'dashboard';
    return (
      this.context.router.transitionTo(Router.makePathname(
        to, { courseId: course.id }, { query: { showIntro: 'true' } }
      ))
    );
  }

  render() {
    return (
      <div>
        <h4>We’re building your Tutor course…</h4>
        <p>Should take about 10 seconds</p>
      </div>
    )
  }

}
