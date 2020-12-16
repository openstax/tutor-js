import PropTypes from 'prop-types';
import React from 'react';
import { styled, css } from 'vendor';
import { isFunction, partial, defer } from 'lodash';
import classnames from 'classnames';
import keymaster from 'keymaster';
import { PrevIcon, NextIcon } from './icons/pagination';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import ScrollTo from '../helpers/scroll-to';
import S from '../helpers/string';
import { Icon } from 'shared';
import { colors, breakpoint } from 'theme';

// strip html tags out of page title so it's suitable for
// setting on the document
const cleanTitle = (title) => title.replace(/<[^>]*>/g, '');

const MobileFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5.6rem;
  background: ${colors.neutral.lightest};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${colors.neutral.pale};
  z-index: 1;
  ${breakpoint.reading_pagination`
    display: none;
  `}

  ${props => !props.isPrevEnabled && css`
    justify-content: flex-end;
  `}

  a {
    align-self: stretch;
    display: flex;
    align-items: center;
    padding: 0 ${breakpoint.margins.mobile};
    ${breakpoint.only.tablet`
      padding: 0 ${breakpoint.margins.tablet};
    `}
    &[disabled] {
      display: none;
    }
  }

  svg {
    margin: 0;
  }
  svg + span, span + svg {
    margin-left: 0.8rem;
  }
`;

const IconWrapper = styled.div.attrs({
  className: 'arrow-wrapper',
})`
  &&.arrow-wrapper {
    width: 100%;
    height: 100%;
    max-width: 100px;
  }
`;

export default
@observer
class PagingNavigation extends React.Component {

  static propTypes = {
    children:             PropTypes.node.isRequired,
    onForwardNavigation:  PropTypes.func.isRequired,
    onBackwardNavigation: PropTypes.func.isRequired,
    isForwardEnabled:     PropTypes.bool.isRequired,
    isBackwardEnabled:    PropTypes.bool.isRequired,
    forwardRenderer:      PropTypes.node,
    backwardRenderer:     PropTypes.node,
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
    renderMobileFooter: PropTypes.bool,
  }

  static defaultProps = {
    scrollOnNavigation: true,
    enableKeys: true,
    forwardHref: '#',
    backwardHref: '#',
    forwardRenderer: <IconWrapper><NextIcon /></IconWrapper>,
    backwardRenderer: <IconWrapper><PrevIcon /></IconWrapper>,
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

  @computed get backwardLinkProps() {
    const cb = this.props.isBackwardEnabled ? this.props.onBackwardNavigation : null;
    return {
      href: this.props.backwardHref,
      target: '_blank',
      tabIndex: this.props.isBackwardEnabled ? 0 : -1,
      disabled: cb == null,
      title: S.stripHTMLTags(this.props.titles.previous),
      'aria-controls': 'paged-content',
      onClick: partial(this.clickHandler, cb, this.props.backwardHref),
      className: classnames('paging-control', 'prev', { active: this.activeNav === 'prev' }),
    };
  }

  @computed get forwardLinkProps() {
    const cf = this.props.isForwardEnabled ? this.props.onForwardNavigation : null;
    return {
      href: this.props.forwardHref,
      tabIndex: this.props.isForwardEnabled ? 0 : -1,
      disabled: cf == null,
      title: S.stripHTMLTags(this.props.titles.next),
      'aria-controls': 'paged-content',
      onClick: partial(this.clickHandler, cf, this.props.forwardHref),
      className: classnames('paging-control', 'next', { active: this.activeNav === 'next' }),
    };
  }

  renderPrev() {
    return (
      <a data-test-id="go-backward" {...this.backwardLinkProps}>
        {this.props.backwardRenderer}
      </a>
    );
  }

  renderNext() {
    return (
      <a data-test-id="go-forward" {...this.forwardLinkProps}>
        {this.props.forwardRenderer}
      </a>
    );
  }

  renderMobileFooter() {
    return (
      <MobileFooter className="paging-footer" isPrevEnabled={this.props.isBackwardEnabled}>
        <a data-test-id="footer-go-backward" {...this.backwardLinkProps}>
          <Icon type="chevron-left" /> <span>Previous</span>
        </a>
        <a data-test-id="footer-go-forward" {...this.forwardLinkProps}>
          <span>Next</span> <Icon type="chevron-right" />
        </a>
      </MobileFooter>
    );
  }
  
  renderControls() {
    if (!this.props.controls) return null;

    return (
      <div className="action-controls">
        {this.props.controls}
      </div>
    );
  }

  render() {
    return (
      <>
        <div className={classnames('tutor-paging-navigation', this.props.className)}>
          {this.renderControls()}
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
        {this.props.renderMobileFooter && this.renderMobileFooter()}
      </>
    );
  }
}
