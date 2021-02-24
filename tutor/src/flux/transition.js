import _ from 'underscore';
import flux from 'flux-react';
import DestinationHelper from '../helpers/routes-and-destinations';

const TransitionActions = flux.createActions([
    'load',
    'reset',
    '_get',
]);


// Transition Store only loads into memory paths that are 'pushed'
// onto the react-router history and are reported as rememberable by
// DestinationHelper
//
// This means that the back button will only track the routes that are
// 'transitioned' to and not those that 'replace' location,
// as is the case with router.replaceWith
//
// TLDR: Use router.history.push or Router.Link for routes you want
// in History and back button.  Only use router.replaceWith when you
// want that route to be ignored in History and back.

const TransitionStore = flux.createStore({
    actions: _.values(TransitionActions),
    _local: [],

    load(path) {
        let last;
        const history = this._get();
        if (history.length) { last = history[history.length - 1]; }
        if ((path !== last) && DestinationHelper.shouldRememberRoute(path)) {
            this._local.push(path);
        }
    },

    reset() {
        return this._local = [];
    },

    _get() {
        return this._local;
    },

    exports: {
        getPrevious(current) {
            if (!current) {
                current = window.document != null ? window.document.location.pathname : undefined;
            }
            for (let i = this._local.length - 1; i >= 0; i--) {
                const path = this._local[i];
                if (path !== current) {
                    return { path, name: DestinationHelper.destinationFromPath(path) };
                }
            }
            return null;
        },
    },
});

export { TransitionActions, TransitionStore };
