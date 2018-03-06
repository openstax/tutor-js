import React from 'react';
import { get } from 'lodash';
import MathJaxHelper from 'shared/helpers/mathjax';
import api from './api';
import { ReactHelpers } from 'shared';
// import { AnswerActions, AnswerStore } from './stores/answer';
// import { QuestionActions, QuestionStore } from './stores/answer';
// import { ExerciseActions, ExerciseStore } from './stores/exercise';
// import Exercise from './components/exercise';

function loadApp() {
  api.start();
  MathJaxHelper.startMathJax();
  const data = JSON.parse(
    get(document.getElementById('exercises-boostrap-data'), 'innerHTML', '{}')
  );
  // Both require and module.hot.accept must be passed a bare string, not variable
  const Renderer = ReactHelpers.renderRoot( function() {
    const Component = require('./app').default;
    return () => React.createElement(Component, { data });
  });
  if (module.hot) { return module.hot.accept('./app', Renderer); }
};

document.addEventListener('DOMContentLoaded', loadApp);
