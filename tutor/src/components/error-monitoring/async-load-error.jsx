import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import OXColoredStripe from 'shared/components/ox-colored-stripe';
import { reloadOnce, forceReload } from '../../helpers/reload';

import Raven from '../../models/app/raven';

class AsyncLoadError extends React.Component {

    static propTypes = {
        error: PropTypes.object.isRequired,
    }

    componentDidMount() {
        reloadOnce();
    }

    render() {

        return (
            <div className="invalid-page">
                <OXColoredStripe />
                <h1>
          Uh-oh, the page failed to load
                </h1>
                <p>{String(this.props.error)}</p>
                <Button variant="primary" onClick={forceReload}>Retry</Button>
            </div>
        );
    }

}


export default
class ErrorBoundary extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
    }

    state = { error: null };

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        Raven.captureException(error, errorInfo);
    }

    render() {
        const { error } = this.state;
        if (error) {
            return <AsyncLoadError error={error} />;
        }

        return this.props.children;
    }
}
