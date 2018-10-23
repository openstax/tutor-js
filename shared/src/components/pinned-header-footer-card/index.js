import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import omit from 'lodash/omit';

import ScrollListenerMixin from '../../mixins/ScrollListener';

import ResizeListenerMixin from '../resize-listener-mixin';
import GetPositionMixin from '../get-position-mixin';
import HandleBodyClassesMixin from '../handle-body-classes-mixin';

import { PinnedHeader, CardBody, PinnableFooter } from './sections';

export default createReactClass({
  displayName: 'PinnedHeaderFooterCard',

  propTypes: {
    cardType: PropTypes.string.isRequired,
    buffer: PropTypes.number,
    scrollSpeedBuffer: PropTypes.number,
    forceShy: PropTypes.bool,
    pinnedUntilScroll: PropTypes.bool,
    containerBuffer: PropTypes.number,
  },

  getDefaultProps() {
    return {
      buffer: 60,
      scrollSpeedBuffer: 30,
      forceShy: false,
      containerBuffer: 30,
    };
  },

  getInitialState() {
    return {
      offset: 0,
      shy: false,
      pinned: true,
      shouldBeShy: true,
      headerHeight: 0,
      containerMarginTop: '0px',
    };
  },

  mixins: [ScrollListenerMixin, ResizeListenerMixin, GetPositionMixin, HandleBodyClassesMixin],

  _getClasses(props, state) {
    if (props == null) { ((((((({ props } = this))))))); }
    if (state == null) { ((((((({ state } = this))))))); }

    return {
      [`${props.cardType}-view`]: true,
      'pinned-view': true,
      'pinned-force-shy': props.forceShy,
      'pinned-on':  state.pinned,
      'pinned-shy': state.shy,
    };
  },

  UNSAFE_componentWillMount() {
    return this.setBodyClasses();
  },

  componentWillUnmount() {
    return this.unsetBodyClasses();
  },

  getOffset() {
    if (this.props.fixedOffset != null) {
      return this.props.fixedOffset;
    } else if (this.refs.header != null) {
      return this.getTopPosition(ReactDOM.findDOMNode(this.refs.header));
    }
  },

  setOffset() {
    return this.setState({ offset: this.getOffset() });
  },

  shouldPinHeader(prevScrollTop, currentScrollTop) {
    return (this.props.pinnedUntilScroll && !this.state.hasScrolled) ||
      (currentScrollTop >= (this.state.offset - this.props.buffer));
  },

  onPageScroll() {
    return this.setState({ hasScrolled: true });
  },

  isScrollingSlowed(prevScrollTop, currentScrollTop) {
    return Math.abs(prevScrollTop - currentScrollTop) <= this.props.scrollSpeedBuffer;
  },

  isScrollingDown(prevScrollTop, currentScrollTop) {
    return currentScrollTop > prevScrollTop;
  },

  isScrollPassBuffer(prevScrollTop, currentScrollTop) {
    return currentScrollTop >= (this.props.buffer + this.state.offset);
  },

  shouldBeShy(prevScrollTop, currentScrollTop) {
    // should not pin regardless of scroll direction if the scroll top is above buffer
    if (!this.isScrollPassBuffer(prevScrollTop, currentScrollTop)) {
      return false;
    // otherwise, when scroll top is below buffer
    // and on down scroll
    } else if (this.isScrollingDown(prevScrollTop, currentScrollTop)) {
      // header should pin
      return true;

    // or when up scrolling is slow
    } else if (this.isScrollingSlowed(prevScrollTop, currentScrollTop)) {
      // leave the pinning as is
      return this.state.shy;

    // else, the only case left is if up scrolling is fast
    } else {
      // unpin on fast up scroll
      return false;
    }
  },

  unPin() {
    return this.setState({ pinned: false });
  },

  updatePinState(prevScrollTop) {
    const nextState = {
      // allow shouldBeShy override if needed
      shy: this.state.shouldBeShy || this.shouldBeShy(prevScrollTop, this.state.scrollTop),

      pinned: this.shouldPinHeader(prevScrollTop, this.state.scrollTop),

      // reset shouldBeShy
      shouldBeShy: false,
    };

    // set the pinned state
    this.setState(nextState);
    return this.setBodyClasses(this.props, nextState);
  },

  forceShy() {
    if (typeof window.scroll === 'function') {
      window.scroll(0, this.props.buffer + this.state.offset);
    }
    return this.setState({ shouldBeShy: true });
  },

  getHeaderHeight() {
    let headerHeight;
    const header = ReactDOM.findDOMNode(this.refs.header);
    return headerHeight = (header != null ? header.offsetHeight : undefined) || 0;
  },

  setOriginalContainerMargin() {
    const container = ReactDOM.findDOMNode(this.refs.container);
    if (!container) { return; }

    if (window.getComputedStyle != null) { return this.setState({ containerMarginTop: window.getComputedStyle(container).marginTop }); }
  },

  setContainerMargin() {
    const headerHeight = this.getHeaderHeight();
    const container = ReactDOM.findDOMNode(this.refs.container);
    if (!container) { return; }

    return this.setState({ headerHeight });
  },

  _resizeListener() {
    return this.setContainerMargin();
  },

  componentDidMount() {
    this.setOffset();
    this.updatePinState(0);
    this.setOriginalContainerMargin();
    return this.setContainerMargin();
  },

  componentDidUpdate(prevProps, prevState) {
    const didOffsetChange = (!this.state.pinned) && !(this.state.offset === this.getOffset());
    const didShouldPinChange = !prevState.pinned === this.shouldPinHeader(prevState.scrollTop, this.state.scrollTop);
    const didShouldBeShyChange = !prevState.shy === this.shouldBeShy(prevState.scrollTop, this.state.scrollTop);
    const didHeaderHeightChange = !(prevState.headerHeight === this.getHeaderHeight());
    if (didOffsetChange) { this.setOffset(); }
    if (didShouldPinChange || didShouldBeShyChange) { this.updatePinState(prevState.scrollTop); }
    if (didHeaderHeightChange || didShouldPinChange) { return this.setContainerMargin(); }
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.forceShy && !this.props.forceShy) { this.forceShy(); }
    return this.setBodyClasses();
  },

  render() {
    let containerStyle, pinnedHeader;
    const { className } = this.props;
    const classes = classnames('pinned-container', className);

    const childrenProps = omit(this.props, 'children', 'header', 'footer', 'className');

    if (this.state.pinned) {
      containerStyle =
        { marginTop: `${this.state.headerHeight + this.props.containerBuffer}px` };
    } else {
      containerStyle =
        { marginTop: this.state.containerMarginTop };
    }

    if (this.props.header != null) {
      pinnedHeader = <PinnedHeader {...childrenProps} ref="header">
        {this.props.header}
      </PinnedHeader>;
    }

    return (
      <div className={classes} style={containerStyle} ref="container">
        {pinnedHeader}
        {this.props.children}
      </div>
    );
  },
});
