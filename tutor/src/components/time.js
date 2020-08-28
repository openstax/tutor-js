import TimeModel from '../models/time';
import PropTypes from 'prop-types';
import React from 'react';
import TimeHelper from '../helpers/time';
import { moment } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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

  dateFormat = (value) => { switch (value) {
    case 'shortest': return 'M/D'; // 9/14
    case 'short': return 'MMM DD, YYYY'; // Feb 14, 2010
    case 'concise': return 'ddd, MMM DD[,] h:mma';
    case 'medium': return 'dddd, MMMM Do YYYY, h:mma'; // Sunday, February 14th 2010, 3:25pm
    case 'long': return 'dddd, MMMM Do YYYY, h:mm:ss a'; // Sunday, February 14th 2010, 3:25:50 pm
    default: return value;
  } };

  render() {
    let { format, date } = this.props;

    return (
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip>
            {moment(date).format(this.dateFormat('medium'))} {TimeHelper.momentOffsetWithBrowserTzName(date)}
          </Tooltip>
        }
      >
        <time>
          {moment(date).format(this.dateFormat(format))}
        </time>
      </OverlayTrigger>
    );
  }
}
