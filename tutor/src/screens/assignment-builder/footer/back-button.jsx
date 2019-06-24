import { React, PropTypes, observer } from '../../../helpers/react';
import TourAnchor from '../../../components/tours/anchor';
import TaskPlanHelper from '../../../helpers/task-plan';
import { Link } from 'react-router-dom';

const BackButton = observer(({ ux: { course, isEditable } }) => {
  if (isEditable) { return null; }

  return (
    <TourAnchor id="builder-back-button">
      <Link {...TaskPlanHelper.calendarParams(course)} className="btn btn-default">
        Back to Calendar
      </Link>
    </TourAnchor>
  );
});
BackButton.displayName = 'BackButton';
BackButton.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default BackButton;



// import PropTypes from 'prop-types';
// import React from 'react';
// import { Link } from 'react-router-dom';
//
// export default class BackButton extends React.Component {
//
//   static propTypes = {
//     isEditable: PropTypes.bool.isRequired,
//     course: PropTypes.object.isRequired,
//   }
//
//   render() {
//     const { isEditable, course } = this.props;
//
//     if (isEditable) { return null; }
//
//     return (
//       <Link {...TaskPlanHelper.calendarParams(course)} className="btn btn-default">
//         Back to Calendar
//       </Link>
//     );
//   }
// }
