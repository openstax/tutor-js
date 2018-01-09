import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { ReferenceBookExerciseActions, ReferenceBookExerciseStore } from '../../flux/reference-book-exercise';
import { get } from 'lodash';
import LoadableItem from '../../components/loadable-item';
import { ArbitraryHtmlAndMath, Question } from 'shared';

function ReferenceBookMissingExercise(props) {
  const {exerciseAPIUrl} = props;

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

ReferenceBookMissingExercise.displayName = 'ReferenceBookMissingExercise';

function ReferenceBookExercise(props) {
  const {exerciseAPIUrl} = props;
  const ex = ReferenceBookExerciseStore.get(exerciseAPIUrl);

  const question = get(ex, 'items[0].questions[0]');
  if (!question) {
    // warning about missing exercise --
    // is there a need to show the reader anything?
    console.warn(`WARNING: ${exerciseAPIUrl} appears to be missing.`);
    return (
      <ReferenceBookMissingExercise exerciseAPIUrl={exerciseAPIUrl} />
    );
  }

  return (
    <Question model={question} />
  );
}

ReferenceBookExercise.displayName = 'ReferenceBookExercise';

class ReferenceBookExerciseShell extends React.Component {
  static displayName = 'ReferenceBookExerciseShell';

  isLoading = () => {
    const {exerciseAPIUrl} = this.props;
    return (
      ReferenceBookExerciseStore.isLoading(exerciseAPIUrl) || ReferenceBookExerciseStore.isQueued(exerciseAPIUrl)
    );
  };

  load = () => {
    const {exerciseAPIUrl} = this.props;
    if (!this.isLoading()) { return ReferenceBookExerciseActions.load(exerciseAPIUrl); }
  };

  renderExercise = () => {
    const exerciseHtml = ReactDOMServer.renderToStaticMarkup(<ReferenceBookExercise {...this.props} />);
    return (
      <ArbitraryHtmlAndMath html={exerciseHtml} />
    );
  };

  render() {
    const {exerciseAPIUrl} = this.props;

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
        )}}
        renderError={function() { return <ReferenceBookMissingExercise />; }}
      />
    );
  }
}

export default {ReferenceBookExercise, ReferenceBookExerciseShell};
