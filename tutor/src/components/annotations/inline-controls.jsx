import React from 'react';
import Icon from '../icon';
import HighlightIcon from './highlight-icon';

const InlineControls = ({ style, annotate, highlight }) => (
  style ? (
    <div className="widget arrow-box" style={style}>
      <Icon className="comment" type="comment" alt="annotate" onClick={annotate} />
      <button className="annotate" onClick={annotate}>
        <HighlightIcon role="button" alt="highlight" onClick={highlight} />
      </button>
    </div>
  ) : null
);

InlineControls.propTypes = {
  annotate: React.PropTypes.func.isRequired,
  highlight: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
};

export default InlineControls;
