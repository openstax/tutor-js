import PropTypes from 'prop-types';
import React from 'react';

class CcConflictMessage extends React.Component {
  static propTypes = {
    courseEnrollmentStore: PropTypes.shape({
      conflictDescription: PropTypes.func.isRequired,
      conflictTeacherNames: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    return (
      <span>
        {'\
    We will remove you from '}
        {this.props.courseEnrollmentStore.conflictDescription()}
        {' with'}
        {' '}
        {this.props.courseEnrollmentStore.conflictTeacherNames()}
        . If you want to stay enrolled
        {' '}
        {'\
    in the OpenStax Concept Coach for that course,'}
        {' '}
        <a
          href="http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3AConcept_Coach&q">
          {'\
    contact us.\
    '}
        </a>
      </span>
    );
  }
}


export default CcConflictMessage;
