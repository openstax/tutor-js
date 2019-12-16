import PropTypes from 'prop-types';
import React from 'react';
import { isFunction, partial, defer } from 'lodash';
import classnames from 'classnames';
import keymaster from 'keymaster';
import Arrow from './icons/arrow';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import ScrollTo from '../helpers/scroll-to';

// strip html tags out of page title so it's suitable for
// setting on the document
const cleanTitle = (title) => title.replace(/<[^>]*>/g, '');

export default
@observer
class PagingNavigation extends React.Component {

  static propTypes = {
    children:             PropTypes.node.isRequired,
    onForwardNavigation:  PropTypes.func.isRequired,
    onBackwardNavigation: PropTypes.func.isRequired,
    isForwardEnabled:     PropTypes.bool.isRequired,
    isBackwardEnabled:    PropTypes.bool.isRequired,
    className:            PropTypes.string,
    forwardHref:          PropTypes.string,
    backwardHref:         PropTypes.string,
    enableKeys:           PropTypes.bool,
    scrollOnNavigation:   PropTypes.bool,
    titles:               PropTypes.shape({
      next:     PropTypes.string,
      current:  PropTypes.string,
      previous: PropTypes.string,
    }),
    documentImpl: PropTypes.shape({
      title: PropTypes.string,
    }),
  }

  static defaultProps = {
    scrollOnNavigation: true,
    enableKeys: true,
    forwardHref: '#',
    backwardHref: '#',
    titles: {
      next: 'Go Forward',
      previous: 'Go Back',
    },
    documentImpl: window.document,
  }

  @observable activeNav;
  @observable pendingTimeOut;
  scrollTo = new ScrollTo();

  UNSAFE_componentWillMount() {
    if (this.props.enableKeys) { this.enableKeys(); }
    if (this.props.titles.current) {
      this.props.documentImpl.title = cleanTitle(this.props.titles.current);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.enableKeys && !this.props.enableKeys) {
      this.enableKeys();
    } else if (!nextProps.enableKeys && this.props.enableKeys) {
      this.disableKeys();
    }
    if (nextProps.titles.current) {
      this.props.documentImpl.title = cleanTitle(nextProps.titles.current);
    } else {
      this.setDefaultTitle();
    }
  }

  componentWillUnmount() {
    if (this.pendingTimeOut) {
      clearTimeout(this.pendingTimeout);
    }
    this.setDefaultTitle();
    this.disableKeys();
  }

  setDefaultTitle() {
    this.props.documentImpl.title = 'OpenStax Tutor';
  }

  enableKeys() {
    // wait until next tick to enable keys
    // otherwise it's possible we'll enable them while a keypress event is being processed.
    // When that occurs, the new handlers which will be called for that event, leading to a loop
    defer(() => {
      keymaster('left' , this.keyOnPrev);
      keymaster('right', this.keyOnNext);
    });
  }

  disableKeys() {
    keymaster.unbind('left');
    keymaster.unbind('right');
  }

  toggleNavHighlight(type) {
    this.activeNav = type;
    this.pendingTimeOut = setTimeout(() => {
      this.pendingTimeOut = this.activeNav = null;
    }, 300);
  }

  @action.bound
  keyOnPrev() {
    if (this.props.isBackwardEnabled) {
      this.toggleNavHighlight('prev');
      this.props.onBackwardNavigation(this.props.backwardHref);
    }
  }

  @action.bound
  keyOnNext() {
    if (this.props.isForwardEnabled) {
      this.toggleNavHighlight('next');
      this.props.onForwardNavigation(this.props.forwardHref);
    }
  }

  @action.bound
  clickHandler(action, href, ev) {
    ev.preventDefault();
    if (isFunction(action)) { action(href); }
    if (this.props.scrollOnNavigation) {
      this.scrollTo.scrollToTop();
    }
  }

  renderPrev() {
    const cb = this.props.isBackwardEnabled ? this.props.onBackwardNavigation : null;
    return (
      <a
        href={this.props.backwardHref}
        target="_blank"
        tabIndex={this.props.isBackwardEnabled ? 0 : -1}
        disabled={cb == null}
        title={this.props.titles.previous}
        aria-controls="paged-content"
        onClick={partial(this.clickHandler, cb, this.props.backwardHref)}
        className={classnames('paging-control', 'prev', { active: this.activeNav === 'prev' })}
      >
        <div className="arrow-wrapper">
          <Arrow direction="left" />
        </div>
      </a>
    );
  }

  renderNext() {
    const cb = this.props.isForwardEnabled ? this.props.onForwardNavigation : null;
    return (
      <a
        href={this.props.forwardHref}
        tabIndex={this.props.isForwardEnabled ? 0 : -1}
        disabled={cb == null}
        title={this.props.titles.next}
        aria-controls="paged-content"
        onClick={partial(this.clickHandler, cb, this.props.forwardHref)}
        className={classnames('paging-control', 'next', { active: this.activeNav === 'next' })}
      >
        <div className="arrow-wrapper">
          <Arrow direction="right" />
        </div>
      </a>
    );
  }

  render() {
    return (
      <div className={classnames('tutor-paging-navigation', this.props.className)}>
        {this.renderPrev()}
        <div
          tabIndex="0"
          role="region"
          aria-live="polite"
          id="paged-content"
          className="paged-content"
        >
          {this.props.children}
        </div>
        {this.renderNext()}
      </div>
    );
  }
}
