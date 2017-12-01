import React from 'react';
import Icon from '../icon';

const InlineControls = ({ style, annotate, highlight }) => (
  style ? (
    <div className="widget arrow-box" style={style}>
      <Icon type="comment" alt="annotate" onClick={annotate} />
      <Icon type="pencil" alt="highlight" onClick={highlight} />
    </div>
  ) : null
);

InlineControls.propTypes = {
  annotate: React.PropTypes.func.isRequired,
  highlight: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
};

export default InlineControls;
