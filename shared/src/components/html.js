import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { omit } from 'lodash';
import { __RouterContext as RouterContext } from 'react-router';
import classnames from 'classnames';
import { typesetMath } from '../helpers/mathjax';
import { wrapFrames } from '../helpers/html-videos';


const isExternalLink = (a) => {
  return ('A' == a.tagName && a.origin !== window.location.origin);
};


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
    history: PropTypes.object,
  };

  static contextType = RouterContext;

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
      if (isExternalLink(link)) {
        link.setAttribute('target', '_blank');
      }
    }
    (typeof this.props.processHtmlAndMath === 'function' ? this.props.processHtmlAndMath(root) : undefined) || typesetMath(this.props.windowImpl);
    return wrapFrames(root, this.props.shouldExcludeFrame);
  };

  onClick = (ev) => {
    if (!isExternalLink(ev.target) && this.context.history) {
      this.context.history.push(ev.target.pathname + ev.target.hash);
      ev.preventDefault();
    }
  }

  render() {
    const { className, block } = this.props;

    const otherProps = omit(this.props, 'staticContext', 'className', 'block', 'html', 'shouldExcludeFrame', 'processHtmlAndMath');
    const ourProps = {
      className: classnames('openstax-has-html', className),
      dangerouslySetInnerHTML: this.getHTMLFromProp(),
      onClick: this.onClick,
    };


    if (block) {
      return (
        <div {...otherProps} {...ourProps} />
      );
    } else {
      return (
        <span {...otherProps} {...ourProps} />
      );
    }
  }
}

export default ArbitraryHtmlAndMath;
