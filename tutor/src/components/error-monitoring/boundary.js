import React from 'react';
import { makeContactURL } from '../../helpers/contact';
import Warning from '../warning-modal';

export default
class ErrorBoundary extends React.Component {

  state = { hasError: false };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: error };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    this.props.app.logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.hasError.toString()
      const mailTo = makeContactURL({
        config: { data: { error } },
      });
      return (
        <Warning title="Something went wrong…">
          <p>
            Please <a href={mailTo}>contact us</a> to file a bug report.
          </p>
          <p>error details: {error}</p>
        </Warning>
      );
    }

    return this.props.children;
  }
}
