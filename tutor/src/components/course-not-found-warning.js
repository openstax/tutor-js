import React from 'react';
import PropTypes from 'prop-types';
import WarningModal from './warning-modal';
import TutorRouter from '../helpers/router';

export
class CourseNotFoundWarning extends React.Component {

  static propTypes = {
    areaName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    areaName: 'course',
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  goToMyCourses() {
    this.context.router.history.push(TutorRouter.makePathname('myCourses'));
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
