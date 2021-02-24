import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Router from '../../helpers/router';
import TutorLink from '../link';
import IconAdd from '../icons/add';
import TourAnchor from '../tours/anchor';

@withRouter
@observer
export default
class CreateACourse extends React.Component {

  static propTypes = {
      isHovering: PropTypes.bool,
      history: PropTypes.object.isRequired,
  }

  onDrop(course) {
      const url = Router.makePathname('createNewCourse', { sourceId: course.id });
      this.props.history.push(url);
  }

  renderAddZone() {
      return (
          <div className="my-courses-add-zone">
              <TutorLink
                  to="createNewCourse"
                  className={classnames({ 'is-hovering': this.props.isHovering })}>
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
