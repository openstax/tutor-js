import React from 'react';
import { observer } from 'mobx-react';
import Icon from '../icon';
import HighlightIcon from './highlight-icon';

const InlineControls = observer(({  selection, annotate, parentRect, highlight }) => {
  if (!selection) { return null; }

  const { rect } = selection;
  const style = {
    top: `${rect.top - 70 - parentRect.top}px`,
    right: `${parentRect.right - rect.right - 10}px`,
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

InlineControls.propTypes = {
  annotate: React.PropTypes.func.isRequired,
  highlight: React.PropTypes.func.isRequired,
  selection: React.PropTypes.object,
  parentRect:  React.PropTypes.object,
};

export default InlineControls;
