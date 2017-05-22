import React from 'react';
import { BrowserRouter, Match } from 'react-router';
import App from './app';

export default function TutorRoot() {
  return (
    <BrowserRouter>
      <div className="tutor-root">
        <Match
          pattern="/"
          render={props => <App {...props} />}
        />
      </div>
    </BrowserRouter>
  );
}
