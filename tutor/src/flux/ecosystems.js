import _ from 'underscore';
import flux from 'flux-react';

const LOADING = 'loading';
const FAILED  = 'failed';

const EcosystemsActions = flux.createActions([
    'load',
    'loaded',
    'FAILED',
]);

const EcosystemsStore = flux.createStore({
    actions: _.values(EcosystemsActions),
    _asyncStatus: null,

    load() { // Used by API
        this._asyncStatus = LOADING;
        return this.emit('load');
    },

    loaded(ecosystems) {
        this._asyncStatus = null;
        this._ecosystems = ecosystems;
        return this.emit('loaded');
    },

    FAILED() {
        this._asyncStatus = FAILED;
        return this.emit('failed');
    },

    exports: {
        isLoaded() { return !_.isEmpty(this._ecosystems); },
        isLoading() { return this._asyncStatus === LOADING; },
        isFailed() { return this._asyncStatus === FAILED; },

        allBooks() {
            return _.map(this._ecosystems, ecosystem => _.extend( _.first(ecosystem.books), { ecosystemId: `${ecosystem.id}`, ecosystemComments: ecosystem.comments } ));
        },

        first() {
            return _.first(this._ecosystems);
        },

        getBook(ecosystemId) {
            return _.first( _.findWhere(this._ecosystems, { id: parseInt(ecosystemId, 10) }).books );
        },
    },
});


export { EcosystemsActions, EcosystemsStore };
