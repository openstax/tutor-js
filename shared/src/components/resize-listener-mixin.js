import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { throttle, defer } from 'lodash';

export default {
  propTypes: {
    resizeThrottle: PropTypes.number,
  },

  getDefaultProps() {
    return { resizeThrottle: 200 };
  },

  getInitialState() {
    return {
      windowEl: {},
      componentEl: {},
      sizesInitial: {},
    };
  },

  UNSAFE_componentWillMount() {
    // need to define @resizeListener so that we can throttle resize effect
    // and have access to @state.resizeThrottle or @props.resizeThrottle
    return this.resizeListener = throttle(this.resizeEffect, this.state.resizeThrottle || this.props.resizeThrottle);
  },

  componentDidMount() {
    this._isMounted = true;
    defer(this.setInitialSize);
    return window.addEventListener('resize', this.resizeListener);
  },

  componentWillUnmount() {
    this._isMounted = false;
    return window.removeEventListener('resize', this.resizeListener);
  },

  resizeEffect(resizeEvent) {
    const windowEl = this._getWindowSize();
    const componentEl = this._getComponentSize();
    const sizes = { windowEl, componentEl };

    this.setState(sizes);
    return (typeof this._resizeListener === 'function' ? this._resizeListener(sizes, resizeEvent) : undefined);
  },

  _getWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return { width, height };
  },

  _getComponentSize() {
    if (!this._isMounted) { return { height: 0, width: 0 }; }
    const componentNode = ReactDOM.findDOMNode(this);
    return {
      width: componentNode.offsetWidth,
      height: componentNode.offsetHeight,
    };
  },

  setInitialSize() {
    if (!this._isMounted) { return; }
    const windowEl = this._getWindowSize();
    const componentEl = this._getComponentSize();

    const sizesInitial = { windowEl, componentEl };

    this.setState({ sizesInitial, windowEl, componentEl });
  },
};
