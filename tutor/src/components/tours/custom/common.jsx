import React        from 'react';

import classnames   from 'classnames';
import forEach      from 'lodash/forEach';

function ValueProp({ className, children }) {
  return <div className={classnames('value-prop', className)}>{children}</div>;
}

function ColumnContent({ children }) {
  return <div className="column-content">{children}</div>;
}

function Column({ className, children }) {
  return <div className={classnames('column', className)}>{children}</div>;
}

function TutorBeta() {
  return (
    <span>OpenStax Tutor <span className="beta">beta</span></span>
  );
}

function getClickTarget(clickEvent) {
  return clickEvent.currentTarget.className.includes('joyride-') && [
    'A',
    'BUTTON'
  ].includes(clickEvent.currentTarget.tagName) ? clickEvent.currentTarget : clickEvent.target;
}

function bindClickHandler(handlers) {

  return ((clickEvent) => {
    const el = getClickTarget(clickEvent);
    const dataType = el.dataset.type;

    let handled = false;

    if (el.className.indexOf('joyride-') === 0) {
      forEach(handlers, (handler, name) => {
        if (dataType === name) {
          handled = true;

          clickEvent.preventDefault();
          clickEvent.stopPropagation();

          return handler(clickEvent);
        }
      });
    }

    if (!handled) {
      this.props.step.ride.joyrideRef.onClickTooltip(clickEvent);
    }

  });
}

export {
  ValueProp,
  ColumnContent,
  Column,
  TutorBeta,
  bindClickHandler
};
