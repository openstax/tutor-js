import moment from 'moment';
import { TimeStore } from '../flux/time';
import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
  static defaultProps = {
    compare: 'from',
    customSuffix: undefined,
    toleranceMS: 60000,
    defaultText: 'just now',
  };

  static displayName = 'TimeDifference';

  static propTypes = {
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,

    compareWith: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),

    compare: PropTypes.oneOf(['from', 'to']),
    toleranceMS: PropTypes.number,
    defaultText: PropTypes.string,
  };

  shouldRenderDifference = () => {
    let { date, compareWith, toleranceMS } = this.props;
    if (!compareWith) { compareWith = TimeStore.getNow(); }
    return Math.abs(moment(date).diff(compareWith)) > toleranceMS;
  };

  render() {
    const { date, compareWith, compare, customSuffix, defaultText } = this.props;

    let differenceText = defaultText;
    if (this.shouldRenderDifference()) {
      differenceText = moment(date)[compare](compareWith, (customSuffix != null));
      if (customSuffix != null) { differenceText += customSuffix; }
    }

    return (
      <span>
        {differenceText}
      </span>
    );
  }
}
