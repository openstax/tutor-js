import React        from 'react';

import classnames   from 'classnames';

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

export {
  ValueProp,
  ColumnContent,
  Column,
  TutorBeta
};
