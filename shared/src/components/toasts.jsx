import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import {  modelize, observable, autorun, action, runInAction } from '../model'
import { Store } from '../model/toasts';

const REMOVE_AFTER = 1000 * 7;

@observer
export default
class Toasts extends React.Component {

    static propTypes = {
        toasts: PropTypes.object,
    }

    static defaultProps = {
        toasts: Store,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    queuePopperStop = autorun(() => {
        if (!this.currentToast && !this.props.toasts.isEmpty) {
            runInAction(() => {
                this.currentToast = this.props.toasts.shift();
                if (this.currentToast.isOk) {
                    this.pendingRemoval = setTimeout(this.removeToast, REMOVE_AFTER);
                }
            })
        }
    })

    @observable currentToast;
    @observable pendingRemoval;

    @action.bound removeToast() {
        this.currentToast = null;
    }

    componentWillUnmount() {
        this.queuePopperStop();
        if (this.pendingRemoval) {
            clearTimeout(this.pendingRemoval);
        }
    }

    render() {
        if (!this.currentToast) { return null; }
        const Toast = this.currentToast.component;

        return (
            <div className="toast-notification">
                <Toast toast={this.currentToast} dismiss={this.removeToast} />
            </div>
        );
    }

}
