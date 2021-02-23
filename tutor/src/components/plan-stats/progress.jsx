import PropTypes from 'prop-types';
import React from 'react';
import { map, partial } from 'lodash';
import { ProgressBar } from 'react-bootstrap';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Page } from '../../models/task-plans/teacher/stats';

@observer
export default
class Progress extends React.Component {

  static propTypes = {
    index: PropTypes.number,
    previous: PropTypes.any,
    data: PropTypes.instanceOf(Page).isRequired,
    type: PropTypes.string.isRequired,
    activeSection: PropTypes.string,
  }

  renderPercentBar(data, type, percent, correctOrIncorrect) {
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
        alt={`${percent}% ${correctOrIncorrect}`}
        srOnly />
    );
  }

  renderPercentBars() {
    const { data, type } = this.props;

    const total_count = data.correct_count + data.incorrect_count;
    const correct = total_count ? Math.round((data.correct_count / total_count) * 100) : 0;
    const percents = {};
    if (data.student_count > 0) {
      percents.correct = correct;
    }
    percents.incorrect = 100 - percents.correct || 0;

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
