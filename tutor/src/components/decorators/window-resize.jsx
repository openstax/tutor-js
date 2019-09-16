import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { defer, throttle } from 'lodash';

export default class WinderResizeListener extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    resizeThrottle: PropTypes.number,
  }

  static defaultProps = {
    resizeThrottle: 200,
  }

  constructor(props) {
    super(props);
    this.setState({
      windowEl: {},
      componentEl: {},
      sizesInitial: {},
    });
  }

  UNSAFE_componentWillMount() {
    // need to define @resizeListener so that we can throttle resize effect
    // and have access to @state.resizeThrottle or @props.resizeThrottle
    this.resizeListener = throttle(this.resizeEffect, this.state.resizeThrottle || this.props.resizeThrottle);
  }

  componentDidMount() {
    this._isMounted = true;
    defer(this.setInitialSize);
    window.addEventListener('resize', this.resizeListener);
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', this.resizeListener);
  }


  resizeEffect() {
    const windowEl = this._getWindowSize();
    const componentEl = this._getComponentSize();
    const sizes = { windowEl, componentEl };

    this.setState(sizes);

    //(typeof this._resizeListener === 'function' ? this._resizeListener(sizes, resizeEvent) : undefined)

  }

  _getWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return { width, height };
  }

  _getComponentSize() {
    if (!this._isMounted) { return { height: 0, width: 0 }; }
    const componentNode = ReactDOM.findDOMNode(this);
    return {
      width: componentNode.offsetWidth,
      height: componentNode.offsetHeight,
    };
  }

  setInitialSize() {
    if (!this._isMounted) { return; }

    this.setState({
      sizes: {
        window: this._getWindowSize(),
        self: this._getComponentSize(),
      },
    });
  }

  render() {
    return React.cloneElement(this.props.children, this.state);
  }

}
