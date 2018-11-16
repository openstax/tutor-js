import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';

import Practice from '../performance-forecast/practice';

const PracticeButton = (props) => {

  let text = 'Practice this ';
  text += props.showAll ? 'chapter' : 'section';

  return (
    <Practice courseId={props.courseId} page_ids={props.pageIds}>
      <Button variant="primary" className="-practice">
        {text}
      </Button>
    </Practice>
  );
}
}

PracticeButton.propTypes = {
  courseId: PropTypes.string.isRequired,
  pageIds:  PropTypes.arrayOf(PropTypes.string),
  showAll:  PropTypes.bool.isRequired,
};

export default PracticeButton;
