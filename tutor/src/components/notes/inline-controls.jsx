import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import HighlightIcon from './highlight-icon';
import AnnotateIcon from './annotate-icon';
import getRangeRect from './getRangeRect';


const InlineControls = observer(({ windowImpl, pendingHighlight, annotate, parentRect, highlight }) => {
  if (!pendingHighlight || !pendingHighlight.range) { return null; }

  const rect = getRangeRect(windowImpl, pendingHighlight.range);

  const style = {
    top: `${(rect.top - parentRect.top) - 48}px`,
    right: `${parentRect.right - rect.right - 40}px`,
  };

  return (
    <div className="inline-controls" style={style}>
      <button className="highlight" onClick={highlight}>
        <HighlightIcon role="button" alt="highlight" />
      </button>
      <button className="annotate" onClick={annotate}>
        <AnnotateIcon role="button" alt="annotate" />
      </button>
    </div>
  );

});

InlineControls.displayName = 'InlineControls';

InlineControls.propTypes = {
  windowImpl: PropTypes.object.isRequired,
  annotate: PropTypes.func.isRequired,
  highlight: PropTypes.func.isRequired,
  pendingHighlight: PropTypes.object,
  parentRect:  PropTypes.object,
  rect: PropTypes.object,
};

export default InlineControls;
