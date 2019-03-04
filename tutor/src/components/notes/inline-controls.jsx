import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Icon } from 'shared';
import HighlightIcon from './highlight-icon';
import getRangeRect from './getRangeRect';

const MARGIN = 100; // min amount of space that should be available on right of page

const InlineControls = observer(({ windowImpl, pendingHighlight, annotate, parentRect, highlight }) => {
  if (!pendingHighlight || !pendingHighlight.range) { return null; }

  const rect = getRangeRect(windowImpl, pendingHighlight.range);

  const style = {
    top: `${(rect.top - parentRect.top) - 20}px`,
    right: `${Math.max(parentRect.right - rect.right + MARGIN, MARGIN)}px`,
  };

  return (
    <div className="inline-controls" style={style}>
      <Icon className="annotate" size="lg" type="comment" alt="annotate" onClick={annotate} />
      <button className="highlight" onClick={highlight}>
        <HighlightIcon role="button" alt="highlight" />
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
