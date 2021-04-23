import { React, PropTypes } from 'vendor';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './app';
import { ThemeProvider } from 'styled-components';
import TutorTheme from '../theme.js';


export default function TutorRoot({ app }) {
    return (
        <BrowserRouter>
            <ThemeProvider theme={TutorTheme}>
                <div className="tutor-root openstax">
                    <Route
                        path="/"
                        render={props => <App app={app} {...props} />}
                    />
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

TutorRoot.propTypes = {
    app: PropTypes.object.isRequired,
}
