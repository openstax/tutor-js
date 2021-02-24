import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import LoadingScreen from 'shared/components/loading-animation';
import BindStoreMixin from './bind-store-mixin';

// This component is useful for viewing something that needs to be loaded.
//
// - display 'Loading...', 'Error', or the actual rendered component
// - automatically listens to changes in the appropriate store to re-render
// - calls `load` to fetch the latest version of the component when initially mounted

export default createReactClass({
    displayName: 'Loadable',

    propTypes: {
        render: PropTypes.func.isRequired,
        store: PropTypes.object.isRequired,
        isLoading: PropTypes.func.isRequired,
        isLoaded: PropTypes.func.isRequired,
        isFailed: PropTypes.func.isRequired,
        renderLoading: PropTypes.func,
        renderError: PropTypes.func.isRequired,
        loadingMessage: PropTypes.string,
        refreshButton: PropTypes.any,
        update: PropTypes.any,
    },

    getDefaultProps() {
        const loadingMessage = 'Loading …';
        // Enables a renderStatus prop function with a component other than a div
        return {
            loadingMessage,

            renderError(refreshButton) {
                return (
                    <div className="loadable is-error">
                        {'Error Loading. '}
                        {refreshButton}
                    </div>
                );
            },
        };
    },

    mixins: [BindStoreMixin],

    bindStore() {
        return this.props.store;
    },

    bindUpdate() { return (typeof this.props.update === 'function' ? this.props.update() : undefined) || this.setState({}); },

    render() {
        const { isLoading, refreshButton, loadingMessage, isLoaded, isFailed, render, renderLoading, renderError } = this.props;

        if (isLoading()) {
            return renderLoading ? renderLoading()
                : <LoadingScreen className='loadable is-loading' message={loadingMessage} />;
        } else if (isLoaded()) {
            return render();
        } else if (isFailed()) {
            return renderError(refreshButton);
        } else {
            return render();
        }
    },
});
