import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Icon from '../icon';
import HighlightIcon from './highlight-icon';

const MARGIN = 100; // min amount of space that should be available on right of page

const InlineControls = observer(({ selection, annotate, parentRect, highlight }) => {
  if (!selection) { return null; }

  const { rect } = selection;
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
  annotate: PropTypes.func.isRequired,
  highlight: PropTypes.func.isRequired,
  selection: PropTypes.object,
  parentRect:  PropTypes.object,
};

export default InlineControls;
