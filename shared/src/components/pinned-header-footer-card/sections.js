import PropTypes from 'prop-types';
import React from 'react';

class PinnedHeader extends React.Component {
  static displayName = 'PinnedHeader';

  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const { className } = this.props;
    let classes = 'pinned-header';
    if (className != null) { classes += ` ${className}`; }

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

class PinnableFooter extends React.Component {
  static defaultProps = { pinned: true };

  static displayName = 'PinnableFooter';

  static propTypes = {
    className: PropTypes.string,
    pinned: PropTypes.bool.isRequired,
  };

  render() {
    const { className, pinned } = this.props;
    const classPrefix = pinned ? 'pinned' : 'step';
    let classes = `${classPrefix}-footer`;
    if (className != null) { classes += ` ${className}`; }

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

class CardBody extends React.Component {
  static defaultProps = { pinned: true };

  static displayName = 'CardBody';

  static propTypes = {
    className: PropTypes.string,
    footerClassName: PropTypes.string,
    pinned: PropTypes.bool.isRequired,
  };

  render() {
    let pinnableFooter;
    const { className, pinned, footerClassName, footer, children } = this.props;
    let classes = 'card-body';
    if (className != null) { classes += ` ${className}`; }

    if (footer) {
      pinnableFooter = <PinnableFooter pinned={pinned} className={footerClassName}>
        {footer}
      </PinnableFooter>;
    }

    return (
      <section className={classes} tabIndex="0" role="main">
        {children}
        {pinnableFooter}
      </section>
    );
  }
}

export { PinnedHeader, CardBody, PinnableFooter };
