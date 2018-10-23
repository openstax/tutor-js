import PropTypes from 'prop-types';
import React from 'react';
import Router from 'react-router-dom';

Router = require('../../helpers/router');
import DesktopImage from './desktop-image';

class CCDashboardEmptyPeriod extends React.Component {
  static displayName = 'CCDashboardEmptyPeriod';

  static propTypes = {
    courseId: PropTypes.string,
  };

  render() {
    const courseId = this.props.courseId || Router.currentParams().courseId;
    return (
      <div className="empty-period cc-dashboard-help">
        <h3>
          {`\
    Once students begin working through Concept Coach question sets,
    this dashboard will show insights into your students’ performance.\
    `}
        </h3>
        <div className="svg-container">
          <DesktopImage courseId={courseId} />
        </div>
      </div>
    );
  }
}


export default CCDashboardEmptyPeriod;
