import { React, PropTypes } from 'vendor';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './app';
import { ThemeProvider } from 'styled-components';
import TutorTheme from '../theme.js';
import { Provider as ReduxProvider } from 'react-redux'
import store from '../store'


export default function TutorRoot({ app }) {
    return (
        <BrowserRouter>
            <ReduxProvider store={store}>
                <ThemeProvider theme={TutorTheme}>
                    <div className="tutor-root openstax">
                        <Route
                            path="/"
                            render={props => <App app={app} {...props} />}
                        />
                    </div>
                </ThemeProvider>
            </ReduxProvider>
        </BrowserRouter>
    );
}

TutorRoot.propTypes = {
    app: PropTypes.object.isRequired,
}
