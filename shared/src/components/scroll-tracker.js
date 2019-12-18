import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import {
  extend, reject, sortBy, find, last, get,
  findLastIndex, isEqual, isEmpty, isUndefined,
} from 'lodash';
import GetPositionMixin from './get-position-mixin';

const ScrollTrackerMixin = {
  mixins: [GetPositionMixin],

  propTypes: {
    setScrollPoint: PropTypes.func.isRequired,
    unsetScrollPoint: PropTypes.func,
    scrollState: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  },

  getInitialState() {
    return { scrollPoint: 0 };
  },

  setScrollPoint() {
    const { setScrollPoint, scrollState } = this.props;

    const scrollPoint = this.getTopPosition(ReactDOM.findDOMNode(this));
    this.setState({ scrollPoint });

    return setScrollPoint(scrollPoint, scrollState);
  },

  unsetScrollPoint() {
    const { unsetScrollPoint } = this.props;
    return (typeof unsetScrollPoint === 'function' ? unsetScrollPoint(this.state.scrollPoint) : undefined);
  },

  componentDidMount() {
    return this.setScrollPoint();
  },

  componentWillUnmount() {
    return this.unsetScrollPoint();
  },
};

const ScrollTracker = createReactClass({
  displayName: 'ScrollTracker',
  mixins: [ScrollTrackerMixin],
  propTypes: {
    children: PropTypes.node.isRequired,
  },

  render() {
    return this.props.children;
  },
});

const ScrollTrackerParentMixin = {
  getInitialState() {
    return {
      scrollPoints: [],
      scrollState: {},
      scrollTopBuffer: 0,
    };
  },

  setScrollTopBuffer() {
    const scrollTopBuffer = GetPositionMixin.getTopPosition(ReactDOM.findDOMNode(this));
    return this.setState({ scrollTopBuffer });
  },

  setScrollPoint(scrollPoint, scrollState) {
    const scrollPointData = extend({ scrollPoint }, scrollState);
    this.state.scrollPoints.push(scrollPointData);
    return this.sortScrollPoints();
  },

  unsetScrollPoint(unsetScrollPoint) {
    this.state.scrollPoints = reject(this.state.scrollPoints, scrollPoint => scrollPoint.scrollPoint === unsetScrollPoint);
    return this.sortScrollPoints();
  },

  sortScrollPoints() {
    const sortedDescScrollPoints = sortBy(this.state.scrollPoints, scrollData => -1 * scrollData.scrollPoint);

    return this.setState({ scrollPoints: sortedDescScrollPoints });
  },

  getScrollStateByScroll(scrollTop) {
    const scrollState = find(this.state.scrollPoints, scrollData => {
      return scrollTop > (scrollData.scrollPoint - this.state.scrollTopBuffer - 2);
    });

    return scrollState || last(this.state.scrollPoints);
  },

  areKeysSame(key, keyToCompare) {
    return (key === keyToCompare) || (parseInt(key) === parseInt(keyToCompare));
  },

  getScrollStateByKey(stepKey) {
    const scrollStateIndex = findLastIndex(this.state.scrollPoints, scrollData => {
      return this.areKeysSame(scrollData.key, stepKey);
    });

    return this.state.scrollPoints[scrollStateIndex];
  },

  setScrollState() {
    const scrollState = this.getScrollStateByScroll(this.state.scrollTop);
    this.setState({ scrollState });

    return this.props.setScrollState(scrollState);
  },

  isScrollPointsStable(compareState) {
    return isEqual(this.state.scrollPoints, compareState.scrollPoints);
  },

  shouldCheckForScrollingState(state) {
    if (state == null) { ((({ state } = this))); }
    return !isEmpty(state.scrollPoints) && !isUndefined(state.scrollState) && this.isScrollPointsStable(state);
  },

  componentDidMount() {
    this.setScrollTopBuffer();
    if (this.props.currentStep != null) { this.scrollToKey(this.props.currentStep); }
  },

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (!this.shouldCheckForScrollingState(nextState)) { return; }
    const willScrollStateKeyChange = !this.areKeysSame(nextState.scrollState.key, this.state.scrollState.key);
    if (willScrollStateKeyChange) { this.props.goToStep(nextState.scrollState.key); }
  },

  componentDidUpdate(prevProps, prevState) {
    if (!this.shouldCheckForScrollingState(prevState)) { return; }
    const doesScrollStateMatch = this.areKeysSame(prevState.scrollState.key, get(this.getScrollStateByScroll(this.state.scrollTop), 'key'));
    const didCurrentStepChange = !this.areKeysSame(this.props.currentStep, prevState.scrollState != null ? prevState.scrollState.key : undefined);

    if (!doesScrollStateMatch) {
      this.setScrollState();
    } else if (didCurrentStepChange) {
      this.scrollToKey(this.props.currentStep);
    }
  },

  scrollToKey(stepKey) {
    if (stepKey == null) { return; }
    const scrollState = this.getScrollStateByKey(stepKey);
    if (scrollState == null) { return; }
    window.scrollTo(0, ((scrollState != null ? scrollState.scrollPoint : undefined) - this.state.scrollTopBuffer));
  },
};

export { ScrollTrackerMixin, ScrollTracker, ScrollTrackerParentMixin };
