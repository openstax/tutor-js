import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import { computed, action } from 'mobx';
import { get } from 'lodash';
import { Icon } from 'shared';
import { withRouter } from 'react-router-dom';
import TourAnchor from '../tours/anchor';
import TourContext from '../../models/tour/context';
import Router from '../../helpers/router';
import Course from '../../models/course.js';

import onboardingForCourse from '../../models/course/onboarding';

export default
@withRouter
@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
class PreviewAddCourseBtn extends React.Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    course: PropTypes.instanceOf(Course),
    tourContext: PropTypes.instanceOf(TourContext),
  }

  @computed get ux() {
    return this.props.course ? onboardingForCourse(this.props.course, this.props.tourContext) : null;
  }

  componentWillUnmount() {
    if (this.ux) { this.ux.close(); }
  }

  @action.bound
  onAddCourse() {
    this.props.history.push(
      Router.makePathname('myCourses')
    );
  }

  render() {
    if (!get(this, 'ux.showCreateCourseAction')) { return null; }

    return (
      <TourAnchor
        className="preview-add-course-nav-button"
        id="preview-add-course-nav-button"
      >
        <Button onClick={this.onAddCourse}>
          <Icon type="plus-square" />
          Create a course
        </Button>
      </TourAnchor>
    );
  }
}
