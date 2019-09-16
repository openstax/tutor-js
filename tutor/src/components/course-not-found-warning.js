import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import WarningModal from './warning-modal';
import TutorRouter from '../helpers/router';

@withRouter
class CourseNotFoundWarning extends React.Component {

  static propTypes = {
    areaName: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    areaName: 'course',
  }

  goToMyCourses() {
    this.props.history.push(TutorRouter.makePathname('myCourses'));
  }


  render() {
    const { areaName } = this.props;

    return (
      <WarningModal
        onDismiss={this.goToMyCourses}
        title={`Sorry, you can’t access this ${areaName}`}
      >
        Either it does not exist or you do not have permission to access it.
      </WarningModal>
    );
  }
}

export { CourseNotFoundWarning };
