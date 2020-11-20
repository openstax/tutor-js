import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const CreateQuestionButton = (props) => {
  if(props.exerciseType !== 'homework') {
    return null;
  }
  
  return (
    <Button variant="primary">
        Create question
    </Button>
  );
};

CreateQuestionButton.propTypes = {
  exerciseType: PropTypes.string.isRequired,
};

export default CreateQuestionButton;
