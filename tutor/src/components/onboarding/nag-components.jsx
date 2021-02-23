import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export function OnboardingNag({ className, children }) {
  return <div className={classnames('onboarding-nag', className)}>{children}</div>;
}
OnboardingNag.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
}

export function Heading({ children }) {
  return <div className="heading">{children}</div>;
}
Heading.propTypes = {
  children: PropTypes.any,
}

export function Body({ children }) {
  return <div className="body">{children}</div>;
}
Body.propTypes = {
  children: PropTypes.any,
}

export function Footer({ className, children }) {
  return <div className={classnames('footer', className)}>{children}</div>;
}
Footer.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
}
