import { bind } from 'lodash';
// imported from the inactive react-scroll-components project
// https://github.com/jeroencoumans/react-scroll-components
// Updated to work with React versions > 15.3
// which lack the ViewportMetrics that the original relied on
//


var win = typeof window !== 'undefined' ? window : false;
const ScrollElement = document.documentElement || document.body.parentNode || document.body;

var ScrollListenerMixin = {

  getDefaultProps() {
    return {
      endScrollTimeout: 300,
    };
  },

  getInitialState() {
    return {
      scrollTop: 0,
      isScrolling: false,
    };
  },

  componentDidMount() {
    if (win) {
      win.addEventListener('scroll', this._onPageScroll);
    }
  },

  componentWillUnmount() {
    if (win) {
      win.removeEventListener('scroll', this._onPageScroll);
    }
  },

  _onPageScrollEnd() {
    const { scrollTop } = ScrollElement;
    if (scrollTop === this.state.scrollTop) {
      win.clearTimeout(this._pageScrollTimeout);
      this.setState({ isScrolling: false });

      if (typeof this.onPageScrollEnd === 'function') {
        this.onPageScrollEnd(scrollTop);
      }
    }
  },

  _onPageScroll() {
    const { scrollTop } = ScrollElement;
    this.setState({
      scrollTop: scrollTop,
      isScrolling: true,
    });
    win.clearTimeout(this._pageScrollTimeout);
    this._pageScrollTimeout = win.setTimeout(this._onPageScrollEnd, this.props.endScrollTimeout);
    if (typeof this.onPageScroll === 'function') {
      this.onPageScroll(scrollTop);
    }
  },
};

export default ScrollListenerMixin;
