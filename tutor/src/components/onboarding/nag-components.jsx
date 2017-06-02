import React from 'react';
import classnames from 'classnames';

export function OnboardingNag({ className, children }) {
  return <div className={classnames('onboarding-nag', className)}>{children}</div>;
}

export function Heading({ children }) {
  return <div className="heading">{children}</div>;
}

export function Body({ children }) {
  return <div className="body">{children}</div>;
}

export function Footer({ className, children }) {
  return <div className={classnames('footer', className)}>{children}</div>;
}
