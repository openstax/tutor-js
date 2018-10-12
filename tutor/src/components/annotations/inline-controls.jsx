import React from 'react';
import { observer } from 'mobx-react';
import Icon from '../icon';
import HighlightIcon from './highlight-icon';

const MARGIN = 100; // min amount of space that should be available on right of page

const InlineControls = observer(({rect, pendingHighlight, annotate, parentRect, highlight }) => {
  if (!pendingHighlight || !rect) { return null; }

  const style = {
    top: `${rect.top - 70 - parentRect.top}px`,
    right: `${Math.max(parentRect.right - rect.right - 10, MARGIN)}px`,
  };

  return (
    <div className="inline-controls" style={style}>
      <Icon className="annotate" type="comment" alt="annotate" onClick={annotate} />
      <button className="highlight" onClick={highlight}>
        <HighlightIcon role="button" alt="highlight" />
      </button>
    </div>
  );

});

InlineControls.displayName = 'InlineControls';

InlineControls.propTypes = {
  annotate: React.PropTypes.func.isRequired,
  highlight: React.PropTypes.func.isRequired,
  pendingHighlight: React.PropTypes.object,
  parentRect:  React.PropTypes.object,
  rect: React.PropTypes.object,
};

export default InlineControls;
