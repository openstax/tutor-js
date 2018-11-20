import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';

class FreeResponse extends React.Component {
  static defaultProps = { free_response: '' };

  static displayName = 'FreeResponse';

  static propTypes = {
    free_response: PropTypes.string.isRequired,
  };

  render() {
    const { free_response, student_names } = this.props;

    const freeResponseProps = { className: 'free-response' };

    if (student_names != null) {
      freeResponseProps['data-student-names'] = student_names.join(', ');
    }

    if (!isEmpty(free_response)) {
      return(
        <div {...freeResponseProps}>
          {free_response}
        </div>
      );
    }

    return null;
  }
}

export default FreeResponse;
