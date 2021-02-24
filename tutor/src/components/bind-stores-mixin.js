import _ from 'underscore';

export default {
    // can modify which event you want to bind on as needed.
    _defaultEvent: 'change',

    _defaultUpdate() {
        return this.forceUpdate();
    },

    _addListener({ store, listenTo, callback }) {
        return store.on(listenTo || this._defaultEvent, callback || this._defaultUpdate);
    },

    _removeListener({ store, listenTo, callback }) {
        return store.off(listenTo || this._defaultEvent, callback || this._defaultUpdate);
    },

    _addListeners() {
        const bindEvents = typeof this.getBindEvents === 'function' ? this.getBindEvents() : undefined;
        if (_.isEmpty(bindEvents)) { return; }
        _.each(bindEvents, this._addListener);
    },

    _removeListeners() {
        const bindEvents = typeof this.getBindEvents === 'function' ? this.getBindEvents() : undefined;
        if (_.isEmpty(bindEvents)) { return; }
        _.each(bindEvents, this._removeListener);
    },

    UNSAFE_componentWillMount() { return this._addListeners(); },
    componentWillUnmount() { return this._removeListeners(); },
};
