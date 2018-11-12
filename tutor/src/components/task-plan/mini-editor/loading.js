import PropTypes from 'prop-types';
import React from 'react';

import { Icon } from 'shared';

class Loading extends React.Component {
  static propTypes = {
    planType: PropTypes.string.isRequired,

    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }).isRequired,
  };

  render() {
    return (
      <div
        className="loading"
        data-assignment-type={this.props.planType}
        style={{ left: this.props.position.x, top: this.props.position.y }}>
        <label>
          <Icon type="spinner" spin={true} />
          {' Loading…\
    '}
        </label>
      </div>
    );
  }
}


export default Loading;
