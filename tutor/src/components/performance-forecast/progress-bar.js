import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';
import _ from 'underscore';

import PerformanceForecast from '../../flux/performance-forecast';

import ButtonWithTip from '../buttons/button-with-tip';
import Practice from './practice';

export default class extends React.Component {
  static defaultProps = {
    id: _.uniqueId('progress-bar-tooltip-'),
    canPractice: false,
    ariaLabel:   '',
  };

  static displayName = 'PerformanceForecastProgressBar';

  static propTypes = {
    section:  PropTypes.object.isRequired,
    canPractice: PropTypes.bool,
    courseId:    PropTypes.string.isRequired,
    ariaLabel:   PropTypes.string,
  };

  render() {
    const { section, canPractice, courseId, id, ariaLabel } = this.props;
    const { page_ids } = section;

    const bar = (() => {
      if (PerformanceForecast.Helpers.canDisplayForecast(section.clue)) {
        const percent = Math.round(Number(section.clue.most_likely) * 100);
        const value_interpretation = percent >= 80 ? 'high' : (percent >= 30 ? 'medium' : 'low');
        // always show at least 5% of bar, otherwise it just looks empty
        return (
          <BS.ProgressBar
            aria-label={`Practice - ${ariaLabel}`}
            className={value_interpretation}
            now={Math.max(percent, 5)} />
        );
      } else {
        const msg = canPractice ? 'Practice more to get forecast' : 'Not enough exercises completed';
        return (
          <div className="no-data" aria-label={`${msg} - ${ariaLabel}`}>
            {msg}
          </div>
        );
      }
    })();

    if (canPractice) {
      return (
        <Practice courseId={courseId} page_ids={page_ids}>
          <BS.Button id={id} block={true} role="link">
            {bar}
          </BS.Button>
        </Practice>
      );
    } else {
      return bar;
    }
  }
}
