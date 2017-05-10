import React from 'react';
import classnames from 'classnames';

export function NagWarning({ className, children }) {
  return <div className={classnames('preview-course-nag-warning', className)}>{children}</div>;
}

export function Heading({ children }) {
  return <div className="heading">{children}</div>;
}

export function Body({ children }) {
  return <div className="body">{children}</div>;
}

export function Footer({ children }) {
  return <div className="footer">{children}</div>;
}
