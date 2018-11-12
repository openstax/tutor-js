import React from 'react'; // eslint-disable-line no-unused-vars
import { BrowserRouter, Route } from 'react-router-dom';
import App from './app';
import { ThemeProvider } from 'styled-components';
import TutorTheme from '../theme.js';

export default function TutorRoot() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={TutorTheme}>
        <div className="tutor-root openstax">
          <Route
            path="/"
            render={props => <App {...props} />}
          />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}
