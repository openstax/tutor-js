// imported from the inactive react-scroll-components project
// https://github.com/jeroencoumans/react-scroll-components
// Updated to work with React versions > 15.3
// which lack the ViewportMetrics that the original relied on
//

'use strict';

var win = typeof window !== 'undefined' ? window : false;

var ScrollListenerMixin = {

  getDefaultProps: function () {
    return {
      endScrollTimeout: 300
    };
  },

  getInitialState: function () {
    return {
      scrollTop: 0,
      isScrolling: false
    };
  },

  componentDidMount: function () {
    if (win) {
      win.addEventListener('scroll', this._onPageScroll);
    }
  },

  componentWillUnmount: function () {
    if (win) {
      win.removeEventListener('scroll', this._onPageScroll);
    }
  },

  _onPageScrollEnd: function () {
    var scrollTop = win.document.body.scrollTop;
    if (scrollTop === this.state.scrollTop) {
      win.clearTimeout(this._pageScrollTimeout);
      this.setState({ isScrolling: false });

      if (typeof this.onPageScrollEnd === 'function') {
        this.onPageScrollEnd(scrollTop);
      }
    }
  },

  _onPageScroll: function () {
    const { scrollTop } =(document.documentElement || document.body.parentNode || document.body);

    this.setState({
      scrollTop: scrollTop,
      isScrolling: true
    });

    win.clearTimeout(this._pageScrollTimeout);
    this._pageScrollTimeout = win.setTimeout(this._onPageScrollEnd, this.props.endScrollTimeout);

    if (typeof this.onPageScroll === 'function') {
      this.onPageScroll(scrollTop);
    }
  }
};

module.exports = ScrollListenerMixin;
