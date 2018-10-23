import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';

class SectionPerformance extends React.Component {
  static displayName = 'SectionPerformace';

  static propTypes = {
    performance: PropTypes.number.isRequired,
  };

  render() {
    const { performance } = this.props;

    const percents =
      { correct: performance ? Math.round(performance * 100) : 0 };
    percents.incorrect = 100 - percents.correct;
    const bars = [];

    if (percents.correct) {
      let correctLabel = `${percents.correct}%`;
      correctLabel = percents.correct === 100 ? `${correctLabel} correct` : correctLabel;
      bars.push(<BS.ProgressBar
        key="correct"
        className="reading-progress-bar progress-bar-correct"
        now={percents.correct}
        label={correctLabel}
        type="correct"
        key={1} />
      );
    }

    if (percents.incorrect) {
      const incorrectLabel = percents.incorrect === 100 ? `${percents.incorrect}% incorrect` : '';
      bars.push(<BS.ProgressBar
        key="incorrect"
        className="reading-progress-bar progress-bar-incorrect"
        now={percents.incorrect}
        label={incorrectLabel}
        type="incorrect"
        key={2} />
      );
    }

    return (
      <div>
        <BS.ProgressBar className="reading-progress-group">
          {bars}
        </BS.ProgressBar>
      </div>
    );
  }
}


export default SectionPerformance;
