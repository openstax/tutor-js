import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'underscore';

import { GetPositionMixin } from 'shared';

const ScrollTracker = {
  mixins: [GetPositionMixin],

  propTypes: {
    setScrollPoint: PropTypes.func.isRequired,
    unsetScrollPoint: PropTypes.func,
    scrollState: PropTypes.object.isRequired,
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
    const scrollPointData = _.extend({ scrollPoint }, scrollState);
    this.state.scrollPoints.push(scrollPointData);
    return this.sortScrollPoints();
  },

  unsetScrollPoint(unsetScrollPoint) {
    this.state.scrollPoints = _.reject(this.state.scrollPoints, scrollPoint => scrollPoint.scrollPoint === unsetScrollPoint);
    return this.sortScrollPoints();
  },

  sortScrollPoints() {
    const sortedDescScrollPoints = _.sortBy(this.state.scrollPoints, scrollData => -1 * scrollData.scrollPoint);

    return this.setState({ scrollPoints: sortedDescScrollPoints });
  },

  getScrollStateByScroll(scrollTop) {
    const scrollState = _.find(this.state.scrollPoints, scrollData => {
      return scrollTop > (scrollData.scrollPoint - this.state.scrollTopBuffer - 2);
    });

    return scrollState || _.last(this.state.scrollPoints);
  },

  getScrollStateByKey(stepKey) {
    const scrollStateIndex = _.findLastIndex(this.state.scrollPoints, scrollData => scrollData.key === stepKey);

    return this.state.scrollPoints[scrollStateIndex];
  },

  setScrollState() {
    const scrollState = this.getScrollStateByScroll(this.state.scrollTop);
    this.setState({ scrollState });

    return this.props.setScrollState(scrollState);
  },

  componentDidMount() {
    this.setScrollTopBuffer();
    if (this.props.currentStep != null) { this.scrollToKey(this.props.currentStep); }
  },

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const willScrollStateKeyChange = !(nextState.scrollState.key === this.state.scrollState.key);
    if (willScrollStateKeyChange) { this.props.goToStep(nextState.scrollState.key); }
  },

  componentDidUpdate(prevProps, prevState) {
    const doesScrollStateMatch = (prevState.scrollState.key === __guard__(this.getScrollStateByScroll(this.state.scrollTop), x => x.key));
    const didCurrentStepChange = !(this.props.currentStep === (prevState.scrollState != null ? prevState.scrollState.key : undefined));

    if (!doesScrollStateMatch) {
      this.setScrollState();
    } else if (didCurrentStepChange) {
      this.scrollToKey(this.props.currentStep);
    }
  },

  scrollToKey(stepKey) {
    const scrollState = this.getScrollStateByKey(stepKey);
    return window.scrollTo(0, ((scrollState != null ? scrollState.scrollPoint : undefined) - this.state.scrollTopBuffer));
  },
};


export { ScrollTracker, ScrollTrackerParentMixin };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
