import React from 'react';
import { Button } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import { computed, action } from 'mobx';
import { get } from 'lodash';

import TourAnchor from '../tours/anchor';
import TourContext from '../../models/tour/context';
import Router from '../../helpers/router';
import Courses from '../../models/courses-map.js';
import User from '../../models/user.js';
import onboardingForCourse from '../../models/course/onboarding';

@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
export default class PreviewAddCourseBtn extends React.PureComponent {

  static contextTypes = {
    router: React.PropTypes.object,
  }

  static propTypes = {
    courseId: React.PropTypes.string,
    tourContext: React.PropTypes.instanceOf(TourContext),
  }

  @computed get course() {
    return this.props.courseId ? Courses.get(this.props.courseId) : null;
  }

  @computed get ux() {
    return this.course ? onboardingForCourse(this.course, this.props.tourContext) : null;
  }

  componentWillUnmount() {
    if (this.ux) { this.ux.close(); }
  }

  @action.bound
  onAddCourse() {
    this.context.router.history.push(
      Router.makePathname('myCourses')
    );
  }

  render() {
    if (!get(this, 'ux.showCreateCourseAction')) { return null; }

    return (
      <TourAnchor id="preview-add-course-nav-button">
        <Button bsStyle="primary" onClick={this.onAddCourse}>Create a course</Button>
      </TourAnchor>
    );
  }
}
