import PropTypes from 'prop-types';
import React from 'react';

class FreeResponse extends React.Component {
  static defaultProps = { free_response: '' };

  static displayName = 'FreeResponse';

  static propTypes = {
    free_response: PropTypes.string.isRequired,
  };

  render() {
    const { free_response, student_names } = this.props;
    FreeResponse = null;

    const freeResponseProps =
      { className: 'free-response' };
    if (student_names != null) { freeResponseProps['data-student-names'] = student_names.join(', '); }

    if ((free_response != null) && free_response.length) {
      FreeResponse = <div {...freeResponseProps}>
        {free_response}
      </div>;
    }

    return FreeResponse;
  }
}

export default FreeResponse;
