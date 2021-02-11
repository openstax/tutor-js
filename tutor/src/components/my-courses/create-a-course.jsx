import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Router from '../../helpers/router';
import TutorLink from '../link';
import IconAdd from '../icons/add';
import TourAnchor from '../tours/anchor';

export default
@withRouter
@observer
class CreateACourse extends React.Component {
  renderAddZone() {
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
