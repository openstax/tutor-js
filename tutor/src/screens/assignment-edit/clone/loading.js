import PropTypes from 'prop-types';
import React from 'react';

import { Icon } from 'shared';

const Loading = ({ planType, position }) => (
  <div
    className="loading"
    data-assignment-type={planType}
    style={{ left: position.x, top: position.y }}>
    <label>
      <Icon type="spinner" spin={true} />
      {' Loading… '}
    </label>
  </div>
);

Loading.propTypes = {
  planType: PropTypes.string.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

export default Loading;
