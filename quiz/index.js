import React from 'react';
import ReactDOM from 'react-dom';
import whenDomReady from 'when-dom-ready';
import { Quiz, Exercise } from './model';
import { UI } from './ui';

//import axios from 'axios';


// const parse = (resp) => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(resp.data, 'application/xhtml+xml');
//   const exercises = Array.from(document.querySelectorAll(
//     '[itemtype="http://schema.org/Question"]'
//   )).map(Exercise.fromXML);

//   return { exercises };
// }

// const render = (props) => {
//   ReactDOM.render(React.createElement(UI, props), document.querySelector('#quiz'));
// }

// whenDomReady().then(() => {
//   render(null);

//   axios({
//     url: 'https://philschatz.com/mc-questions/microbiology.xhtml',
//   })
//   .then(parse)
//   .then(render)
//   .catch((error) => render({ error }))
// }));

whenDomReady().then(() => {
  const quizes = Array.from(document.querySelectorAll(
    '[itemtype="http://schema.org/Quiz"]'
  )).map(xml => new Quiz(xml))
  
  const exercises = [];

  quizes.forEach(q => {
    q.$$('[itemtype="http://schema.org/Question"]').forEach(xml => {
      exercises.push(Exercise.fromXML(xml, q))
    })
  })
//        = Array.from(document.querySelectorAll(
    
//  )).map();
  const root = document.createElement('div');
  document.body.prepend(root);

  ReactDOM.render(React.createElement(UI, { exercises }), root);
});
