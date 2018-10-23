import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';

import Practice from '../performance-forecast/practice';

class PracticeButton extends React.Component {
  static displayName = 'PracticeButton';

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    pageIds:  PropTypes.arrayOf(PropTypes.string),
    showAll:  PropTypes.bool.isRequired,
  };

  render() {
    let text = 'Practice this ';
    text += this.props.showAll ? 'chapter' : 'section';

    return (
      <Practice courseId={courseId} page_ids={pageIds}>
        <BS.Button bsStyle="primary" className="-practice">
          {text}
        </BS.Button>
      </Practice>
    );
  }
}


export default PracticeButton;
