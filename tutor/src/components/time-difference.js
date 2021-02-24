import moment from 'moment';
import Time from '../models/time';
import PropTypes from 'prop-types';
import React from 'react';

export default class TimeDifference extends React.Component {

  static propTypes = {
      date: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
      ]).isRequired,
      customSuffix: PropTypes.string,
      compareWith: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
      ]),
      compare: PropTypes.oneOf(['from', 'to']),
      toleranceMS: PropTypes.number,
      defaultText: PropTypes.string,
  };

  static defaultProps = {
      compare: 'from',
      customSuffix: undefined,
      toleranceMS: 60000,
      defaultText: 'just now',
  };

  shouldRenderDifference = () => {
      let { date, compareWith, toleranceMS } = this.props;
      if (!compareWith) { compareWith = Time.now; }
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
