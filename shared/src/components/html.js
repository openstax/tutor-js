import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import omit from 'lodash/omit';
import classnames from 'classnames';

import { typesetMath } from '../helpers/mathjax';
import { wrapFrames } from '../helpers/html-videos';

export default
class ArbitraryHtmlAndMath extends React.Component {

  static defaultProps = {
    block: false,
    shouldExcludeFrame() { return false; },
  };

  static propTypes = {
    className: PropTypes.string,
    html: PropTypes.string,
    block: PropTypes.bool.isRequired,
    processHtmlAndMath: PropTypes.func,
    shouldExcludeFrame: PropTypes.func,
    windowImpl: PropTypes.object,
  };

  componentDidMount() { return this.updateDOMNode(); }

  // rendering uses dangerouslySetInnerHTML and then runs MathJax,
  // Both of which React can't optimize like it's normal render operations
  // Accordingly, only update if any of our props have actually changed
  shouldComponentUpdate(nextProps) {
    for (let propName in nextProps) {
      const value = nextProps[propName];
      if (this.props[propName] !== value) { return true; }
    }
    return false;
  }

  componentDidUpdate() { return this.updateDOMNode(); }

  getHTMLFromProp = () => {
    const { html } = this.props;
    if (html) {
      return { __html: html };
    }
    return null;
  };

  // Perform manipulation on HTML contained inside the components node.
  updateDOMNode = () => {
    // External links should open in a new window
    const root = ReactDOM.findDOMNode(this);
    const links = root.querySelectorAll('a');
    for (let link of links) {
      if (__guard__(link.getAttribute('href'), x => x[0]) !== '#') { link.setAttribute('target', '_blank'); }
    }
    (typeof this.props.processHtmlAndMath === 'function' ? this.props.processHtmlAndMath(root) : undefined) || typesetMath(this.props.windowImpl);
    return wrapFrames(root, this.props.shouldExcludeFrame);
  };

  render() {
    const { className, block } = this.props;

    console.log(this.props);

    const classes = classnames('openstax-has-html', className);

    const otherProps = omit(this.props, 'className', 'block', 'html', 'shouldExcludeFrame', 'processHtmlAndMath');

    if (block) {
      return (
        <div
          {...otherProps}
          className={classes}
          dangerouslySetInnerHTML={this.getHTMLFromProp()} />
      );
    } else {
      return (
        <span
          {...otherProps}
          className={classes}
          dangerouslySetInnerHTML={this.getHTMLFromProp()} />
      );
    }
  }
}

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
