// inspiration from https://github.com/JakeGinnivan/react-popout
// this version triggers popup directly and leaves it open
// after the parent component unmounts

import PropTypes from 'prop-types';

import React from 'react';
import ReactDOM     from 'react-dom';
import { isFunction, invoke, defaults, map, uniqueId } from 'lodash';
import { autobind } from 'core-decorators';

export default class PopoutWindow extends React.Component {

    static propTypes = {
        title:      PropTypes.string.isRequired,
        children:   PropTypes.node.isRequired,
        onClose:    PropTypes.func.isRequired,
        onReady:    PropTypes.func,
        url:        PropTypes.string,
        options:    PropTypes.object,
        windowImpl: PropTypes.shape({
            open: PropTypes.func,
        }),
    };

    static defaultProps = {
        windowImpl: window,
        url: 'about:blank',
    };

    containerId = uniqueId('popout-container');

    popup = false;

    defaultOptions = {
        toolbar: 'no',
        location: 'no',
        directories: 'no',
        status: 'no',
        menubar: 'no',
        scrollbars: 'yes',
        resizable: 'yes',
        width: 500,
        height: 400,
        top: (o, w) => ((w.innerHeight - o.height) / 2) + w.screenY,
        left: (o, w) => ((w.innerWidth - o.width) / 2) + w.screenX,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        // re-render
        if (this.isOpen && nextProps.children != this.props.children) {
            this.reRender();
        }
    }

    get isOpen() {
        return !!(this.popup && this.containerEl);
    }

    get containerEl() {
        return this.popup.document.getElementById(this.containerId);
    }

    reRender(children = this.props.children) {
        ReactDOM.render(children, this.containerEl);
    }

    print() {
        if (this.isOpen) {
            this.popup.print();
        }
    }


    open(){
        if (this.isOpen) {
            this.reRender();
            this.popup.focus();
            return;
        }
        const options = map(defaults({}, this.props.options, this.defaultOptions), (v, key, o) =>
            `${key}=${v = isFunction(v) ? v(o, this.props.windowImpl) : v}`
        ).join(',');

        this.popup = this.props.windowImpl.open(this.props.url, this.props.title, options);

        this.popup.onbeforeunload = this.onWindowBeforeUnLoad;
        this.popup.onload = this.onWindowLoad;

        // just in case onload fails to fire
        if (this.popup.document.readyState === 'complete') {
            this.onWindowLoad();
        }
    }

    @autobind
    close() {
        invoke(this.popup, 'close');
    }

    @autobind
    onWindowBeforeUnLoad() {
        invoke(this.props, 'onClose');
        ReactDOM.unmountComponentAtNode(this.containerEl);
        this.containerEl.parentNode.removeChild( this.containerEl );
        this.popup = null;
    }

    @autobind
    onWindowLoad() {
        // called twice
        if (this.containerEl) { return; }

        this.popup.document.title = this.props.title;
        const container = this.popup.document.createElement('div');
        container.id = this.containerId;

        this.popup.document.body.appendChild(container);

        ReactDOM.render(this.props.children, container);
        invoke(this.props, 'onReady', this);
    }

    render(){
        return null; // don't need to render anything directly
    }

}
