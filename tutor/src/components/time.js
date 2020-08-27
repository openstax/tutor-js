import TimeModel from '../models/time';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

export default class Time extends React.Component {
  static defaultProps = {
    format: 'short',
    date: TimeModel.now,
  };

  static propTypes = {
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,

    format: PropTypes.string,
  };

  render() {
    let { format, date } = this.props;
    format = (() => { switch (this.props.format) {
      case 'shortest': return 'M/D'; // 9/14
      case 'short': return 'MMM DD, YYYY'; // Feb 14, 2010
      case 'concise': return 'ddd, MMM DD[,] h:mma';
      case 'long': return 'dddd, MMMM Do YYYY, h:mm:ss a'; // Sunday, February 14th 2010, 3:25:50 pm
      default: return this.props.format;
    } })();
    const tz = moment.tz(date, Intl.DateTimeFormat().resolvedOptions().timeZone).format('z');
    const humanTz = tz == 'UTC' ? '' : tz;

    return (
      <time>
        {moment(date).format(format)}
        {this.props.format == 'concise' && ` ${humanTz}`}
      </time>
    );
  }
}
