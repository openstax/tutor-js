import PropTypes from 'prop-types';
import React from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import { uniqueId } from 'lodash';
import Practice from './practice';

export default class extends React.Component {
    static defaultProps = {
        id: uniqueId('progress-bar-tooltip-'),
        canPractice: false,
        ariaLabel:   '',
    };

    static displayName = 'PerformanceForecastProgressBar';

    static propTypes = {
        id: PropTypes.string,
        section:     PropTypes.object.isRequired,
        canPractice: PropTypes.bool,
        course:      PropTypes.object.isRequired,
        ariaLabel:   PropTypes.string,
    };

    render() {
        const { section, canPractice, course, id, ariaLabel } = this.props;
        const { page_ids } = section;

        const bar = (() => {
            if (section.canDisplayForecast) {
                const percent = Math.round(Number(section.clue.most_likely) * 100);
                const value_interpretation = percent >= 80 ? 'high' : (percent >= 30 ? 'medium' : 'low');
                // always show at least 5% of bar, otherwise it just looks empty
                return (
                    <ProgressBar
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
                <Practice course={course} page_ids={page_ids}>
                    <Button id={id} block={true} variant="practice">
                        {bar}
                    </Button>
                </Practice>
            );
        } else {
            return bar;
        }
    }
}
