import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { ReferenceBookExerciseActions, ReferenceBookExerciseStore } from '../../flux/reference-book-exercise';
import { get } from 'lodash';
import LoadableItem from '../loadable-item';
import { ArbitraryHtmlAndMath, Question } from 'shared';
import QuestionModel from 'shared/model/exercise/question';

function ReferenceBookMissingExercise(props) {
  const { exerciseAPIUrl } = props;

  return (
    <small
      className="reference-book-missing-exercise"
      data-exercise-url={exerciseAPIUrl}>
      <i>
        Missing exercise
      </i>
    </small>
  );
}
ReferenceBookMissingExercise.propTypes = {
  exerciseAPIUrl: PropTypes.string,
}
ReferenceBookMissingExercise.displayName = 'ReferenceBookMissingExercise';

export function ReferenceBookExercise(props) {
  const { exerciseAPIUrl } = props;
  const ex = ReferenceBookExerciseStore.get(exerciseAPIUrl);

  let question = get(ex, 'items[0].questions[0]');
  if (!question) {
    // warning about missing exercise --
    // is there a need to show the reader anything?
    // eslint-disable-next-line
    console.warn(`WARNING: ${exerciseAPIUrl} appears to be missing.`);
    return (
      <ReferenceBookMissingExercise exerciseAPIUrl={exerciseAPIUrl} />
    );
  }
  question = new QuestionModel(question);
  return (
    <Question question={question} />
  );
}
ReferenceBookExercise.propTypes = {
  exerciseAPIUrl: PropTypes.string,
}
ReferenceBookExercise.displayName = 'ReferenceBookExercise';

export class ReferenceBookExerciseShell extends React.Component {
  static displayName = 'ReferenceBookExerciseShell';
  static propTypes = {
    exerciseAPIUrl: PropTypes.string,
  }
  isLoading = () => {
    const { exerciseAPIUrl } = this.props;
    return (
      ReferenceBookExerciseStore.isLoading(exerciseAPIUrl) || ReferenceBookExerciseStore.isQueued(exerciseAPIUrl)
    );
  };

  load = () => {
    const { exerciseAPIUrl } = this.props;
    if (!this.isLoading()) { return ReferenceBookExerciseActions.load(exerciseAPIUrl); }
  };

  renderExercise = () => {
    const exerciseHtml = ReactDOMServer.renderToStaticMarkup(<ReferenceBookExercise {...this.props} />);
    return (
      <ArbitraryHtmlAndMath html={exerciseHtml} />
    );
  };

  render() {
    const { exerciseAPIUrl } = this.props;

    return (
      <LoadableItem
        id={exerciseAPIUrl}
        bindEvent={`loaded.${exerciseAPIUrl}`}
        isLoading={this.isLoading}
        load={this.load}
        store={ReferenceBookExerciseStore}
        actions={ReferenceBookExerciseActions}
        renderItem={this.renderExercise}
        renderLoading={function() { return (
          <span className="loading-exercise">
              Loading exercise...
          </span>
        );}}
        renderError={function() { return <ReferenceBookMissingExercise />; }}
      />
    );
  }
}
