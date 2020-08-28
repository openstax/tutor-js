import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import String from '../../helpers/string';
import { ExercisePreview } from 'shared';
import UX from './ux';
import Exercise from '../../models/exercises/exercise';

export default class ExerciseCard extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    exercise: PropTypes.instanceOf(Exercise).isRequired,
  };

  renderHeader() {
    return (
      <div className="types">
        {this.props.ux.exerciseTypes.map(type => (
          <span
            key={type}
            className={classnames(type, { 'is-ignored': this.props.ux.isTypeIgnored(type) })}
          >
            {String.titleize(type)}
          </span>
        ))}
      </div>
    );
  }

  render() {
    const { exercise, ux } = this.props;

    let freeResponse;
    if (ux.show2StepPreview && exercise.content.hasFreeResponse) {
      freeResponse = (
        <div className="exercise-free-response-preview" />
      );
    }

    return (
      <ExercisePreview
        exercise={exercise.content}
        className="exercise"
        header={this.renderHeader()}
        displayFormats={true}
        questionFooters={freeResponse}
        displayAllTags={true}
        displayFeedback={true}
        extractedInfo={exercise}
      >
        <a
          target="_blank"
          className="edit-link"
          href={exercise.url.replace(/@\d+/, '@draft')}
        >
          edit
        </a>
      </ExercisePreview>
    );
  }
}
