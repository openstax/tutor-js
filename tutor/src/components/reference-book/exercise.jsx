/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { ReferenceBookExerciseActions, ReferenceBookExerciseStore } from '../../flux/reference-book-exercise';

import LoadableItem from '../loadable-item';
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
  const {items} = ReferenceBookExerciseStore.get(exerciseAPIUrl);

  if (!(items != null ? items.length : undefined) || (__guard__(__guard__(items != null ? items[0] : undefined, x1 => x1.questions), x => x[0]) == null)) {
    // warning about missing exercise --
    // is there a need to show the reader anything?
    console.warn(`WARNING: ${exerciseAPIUrl} appears to be missing.`);
    return (
      <ReferenceBookMissingExercise exerciseAPIUrl={exerciseAPIUrl} />
    );
  }

  const {questions} = items[0];
  const question = questions[0];

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

function __guard__(value, transform) {
  return (
      (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
  );
}
