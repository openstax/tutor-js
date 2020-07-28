import React from 'react';
import ReactDOM from 'react-dom';
import whenDomReady from 'when-dom-ready';
import { Quiz, Exercise } from './model';
import { UI } from './ui';

whenDomReady().then(() => {
  const quizes = Array.from(document.querySelectorAll(
    '[itemtype="http://schema.org/Quiz"]'
  )).map(xml => new Quiz(xml))
  
  const exercises = [];

  quizes.forEach(q => {
    q.$$('[itemtype="http://schema.org/Question"]').forEach(xml => {
      exercises.push(Exercise.fromXML(xml, q));
    });
  });

  let parent = document.getElementById('main');
  if (!parent) {
    parent = document.body;
  }

  const root = document.createElement('div');
  root.setAttribute('id', 'ox-quiz-app');
  parent.prepend(root);

  ReactDOM.render(React.createElement(UI, { exercises }), root);
});
