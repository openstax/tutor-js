/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React from 'react';
import createReactClass from 'create-react-class';
import { map, partial } from 'lodash';
import { ProgressBar } from 'react-bootstrap';
import classnames from 'classnames';
import { observer } from 'mobx-react';

@observer
export default class Progress extends React.PureComponent {

  static propTypes = {
    data: React.PropTypes.object.isRequired,
    type: React.PropTypes.string.isRequired,
    activeSection: React.PropTypes.string,
  }

  _calculatePercent(num, total) {
    return Math.round((num / total) * 100);
  }

  calculatePercent(data, correctOrIncorrect) {
    if (correctOrIncorrect == null) { correctOrIncorrect = 'correct'; }
    const count = correctOrIncorrect + '_count';

    const total_count = data.correct_count + data.incorrect_count;
    return total_count ? this._calculatePercent(data[count], total_count) : 0;
  }

  renderPercentBar(data, type, percent, correctOrIncorrect) {
    let correct;
    let classes = 'reading-progress-bar';
    classes += ` progress-bar-${correctOrIncorrect}`;
    if (!percent) { classes += ' no-progress'; }

    let label = `${percent}%`;
    if (percent === 100) { label = `${label} ${correctOrIncorrect}`; }

    return (
      <ProgressBar
        className={classes}
        label={label}
        now={percent}
        key={`page-progress-${type}-${data.id}-${correctOrIncorrect}`}
        type={`${correctOrIncorrect}`}
        alt={`${percent}% ${correctOrIncorrect}`} />
    );
  }

  renderPercentBars() {
    const { data, type } = this.props;

    const percents = {
      correct: this.calculatePercent(data, 'correct'),
      incorrect: this.calculatePercent(data, 'incorrect'),
    };

    // make sure percents add up to 100
    if ((percents.incorrect + percents.correct) > 100) {
      percents.incorrect = 100 - percents.correct;
    }

    return map(percents, partial(this.renderPercentBar, data, type));
  }

  render() {
    const { data, type, index, previous, activeSection } = this.props;

    const studentCount = (
      <span className="reading-progress-student-count">
        ({data.student_count} students)
      </span>
    );

    const sectionLabel = data.chapter_section.asString;

    const active = activeSection === sectionLabel;

    const progressClass = classnames('reading-progress', {
      'active': active,
      'inactive': activeSection && !active,
    });

    return (
      <div key={`${type}-bar-${index}`} className={progressClass}>
        <div className="reading-progress-heading">
          <strong>
            <span className="text-success">
              {sectionLabel}
            </span>
            {' '}
            {data.title}
          </strong>
          {' '}
          {studentCount}
        </div>
        <div className="reading-progress-container">
          <ProgressBar className="reading-progress-group">
            {this.renderPercentBars()}
          </ProgressBar>
          {previous}
        </div>
      </div>
    );
  }
}
