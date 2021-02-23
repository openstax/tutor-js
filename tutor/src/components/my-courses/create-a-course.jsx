import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import TutorLink from '../link';
import IconAdd from '../icons/add';
import TourAnchor from '../tours/anchor';

export default
@withRouter
@observer
class CreateACourse extends React.Component {
  renderAddZone() {
    let route;
    if(this.props.appearanceCode) {
      route = {
        to: 'createNewCourseFromOffering',
        params: {
          appearanceCode: this.props.appearanceCode,
        },
      };
    }
    else {
      route = {
        to: 'createNewCourse',
      };
    }
    return (
      <div className="my-courses-add-zone">
        <TutorLink to="createNewCourse">
          <div>
            <IconAdd />
            <span>
              CREATE A COURSE
            </span>
          </div>
        </TutorLink>
      </div>
    );
  }

  render() {
    return (
      <TourAnchor id="create-course-zone">
        {this.renderAddZone()}
      </TourAnchor>);
  }
}
