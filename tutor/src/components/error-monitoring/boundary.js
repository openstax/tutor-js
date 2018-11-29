import React from 'react';
import { makeContactURL } from '../../helpers/contact';

export default
class ErrorBoundary extends React.Component {

  state = { hasError: false };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    this.props.app.logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      const mailTo = makeContactURL();
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>
            Please <a href={mailTo}>contact us</a> to file a bug report.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
