import _ from 'underscore';

export default {
    // can modify which event you want to bind on as needed.
    _bindEvent() {
        return _.result(this, 'bindEvent', this.props.bindEvent || 'change');
    },

    // @bindStore may need to be a function in some cases, i.e. when the store is being passed in as a prop.
    _bindStore() {
        return _.result(this, 'bindStore');
    },

    _bindUpdate(...args) {
        if (this.bindUpdate != null) {
            return this.bindUpdate.apply(this, args);
        } else {
            return this.setState({});
        }
    },

    _addListener() {
        this.boundEvent = this._bindEvent();

        if (typeof this.addBindListener === 'function') {
            this.addBindListener();
        }
        const bindStore = this._bindStore();
        if (this._bindStore != null) { bindStore.on(this.boundEvent, this._bindUpdate); }
    },

    _removeListener() {
        if (typeof this.removeBindListener === 'function') {
            this.removeBindListener();
        }
        const bindStore = this._bindStore();
        if (this._bindStore != null) { bindStore.off(this.boundEvent, this._bindUpdate); }
    },

    UNSAFE_componentWillMount() { return this._addListener(); },
    componentWillUnmount() { return this._removeListener(); },
};
