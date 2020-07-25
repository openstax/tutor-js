import React from 'react';
import LoadingScreen from 'shared/components/loading-animation';
import Quiz from './quiz';
import './styles.scss';

export function UI({ error, exercises }) {
  let body;
  if (!error && !exercises) {
    body = <LoadingScreen />;
  } else if (error) {
    body = <h1>Error: {String(error)}</h1>;
  } else {
    body = <Quiz exercises={exercises} />
  }

  return (
    <div id="wrap">

      <a className="openstax-link" href="https://openstax.org">
        <img src="https://openstax.org/images/logo.svg" width="200" />
      </a>

      <div id="quiz">
        {body}
      </div>
      
    </div>
  )
}
