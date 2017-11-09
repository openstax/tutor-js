import React from 'react'; // eslint-disable-line no-unused-vars
import { BrowserRouter, Route } from 'react-router-dom';
import App from './app';

export default function TutorRoot() {
  return (
    <BrowserRouter>
      <div className="tutor-root">
        <Route
          path="/"
          render={props => <App {...props} />}
        />
      </div>
    </BrowserRouter>
  );
}
