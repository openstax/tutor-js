import PropTypes from 'prop-types';
import React from 'react';

const CcConflictMessage = (props) => {
  return (
    <span>
      {'\
    We will remove you from '}
      {props.courseEnrollmentStore.conflictDescription()}
      {' with'}
      {' '}
      {props.courseEnrollmentStore.conflictTeacherNames()}
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
};


CcConflictMessage.propTypes = {
  courseEnrollmentStore: PropTypes.shape({
    conflictDescription: PropTypes.func.isRequired,
    conflictTeacherNames: PropTypes.func.isRequired,
  }).isRequired,
};

export default CcConflictMessage;
