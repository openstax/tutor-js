import React from 'react';
import ReactDOM from 'react-dom';

import { ScrollToMixin } from 'shared';

// This mixin extends the scroll-to-mixin to handle
// scrolling to a link when it's clicked
const ScrollToLinkMixin = {
  mixins: [ScrollToMixin],

  componentDidMount() {
    ReactDOM.findDOMNode(this)
      .addEventListener('click', this._onScrollClick, false);

    // if a hash is present and it can be scrolled to
    // clear the window's existing hash so that the browser won't jump directly to it
    const { hash } = this.props.windowImpl.location;
    if (hash) {
      this.props.windowImpl.location.hash = '';
      (typeof this.waitToScrollToSelector === 'function' ? this.waitToScrollToSelector(hash) : undefined) || this.scrollToSelector(hash);
    }

    // listen for forward / back navigation between element selections
    return this.props.windowImpl.addEventListener('hashchange', this._onHashChange, false);
  },

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).removeEventListener('click', this._onScrollClick, false);
    return this.props.windowImpl.removeEventListener('hashchange', this._onHashChange, false);
  },

  _onHashChange() {
    if (this.props.windowImpl.location.hash) {
      return this.scrollToSelector(this.props.windowImpl.location.hash);
    }
  },

  _onScrollClick(ev) {
    if (ev.target.tagName !== 'A') { return; }
    if (this.scrollToSelector(ev.target.hash)) {
      return ev.preventDefault();
    }
  },
};

export default ScrollToLinkMixin;
