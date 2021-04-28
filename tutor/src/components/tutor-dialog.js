import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { flow, extend, clone } from 'lodash';

// This is the "real" dialog component. It's rendered to a div under document.body
class DetachedTutorDialog extends React.Component {
    static displayName = 'DetachedTutorDialog';

    static propTypes = {
        title:         PropTypes.string.isRequired,
        onOk:          PropTypes.func.isRequired,
        onCancel:      PropTypes.func.isRequired,
        body:          PropTypes.any.isRequired,
        show:          PropTypes.bool,
        buttons:       PropTypes.arrayOf( PropTypes.element ),
        okBtnText:     PropTypes.string,
        cancelBtnText: PropTypes.string,
        className:     PropTypes.string,
    }

    state = { show: true };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.show != null) { this.setState({ show: nextProps.show }); }
    }

    _hide = () => {
        return this.setState({ show: false });
    };

    hide = () => {
        this._hide();
        return this.props.onCancel();
    };

    render() {
        if (!this.state.show) { return null; }
        const buttons = this.props.buttons || [
            <Button
                key="ok"
                className="ok"
                onClick={flow(this.props.onOk, this._hide)}
                variant="primary">
                {this.props.okBtnText || 'OK'}
            </Button>,
            <Button
                key="cancel"
                className="cancel"
                onClick={flow(this.props.onCancel, this._hide)}>
                {this.props.cancelBtnText || 'Cancel'}
            </Button>,
        ];
        const classes = ['tutor-dialog'];
        if (this.props.className) { classes.push(this.props.className); }

        return (
            <Modal className={classes.join(' ')} show={this.state.show} onHide={this.hide}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        {this.props.title}
                    </Modal.Title>
                </Modal.Header>
                <div className="modal-body">
                    {this.props.body}
                </div>
                <div className="modal-footer">
                    {buttons}
                </div>
            </Modal>
        );
    }
}

export default class TutorDialog extends React.Component {

    static propTypes = {
        title:         PropTypes.string.isRequired,
        onOk:          PropTypes.func.isRequired,
        onCancel:      PropTypes.func.isRequired,
        children:      PropTypes.node.isRequired,
        show:          PropTypes.bool,
        buttons:       PropTypes.arrayOf( PropTypes.element ),
        okBtnText:     PropTypes.string,
        cancelBtnText: PropTypes.string,
        className:     PropTypes.string,
    }

    componentDidMount() {
    // While unlikely, the onOk and onCancel properties could have been updated while the dialog was visible
    // If they were we need to call their current functions
        return TutorDialog.show(extend({}, this.props, { body: this.props.children })).then(
            ( function() { return (typeof this.props.onOk === 'function' ? this.props.onOk(...arguments) : undefined);  }.bind(this)) , ( typeof this.props.onCancel === 'function' ? this.props.onCancel(...arguments) : undefined)
        );
    }

    componentWillUnmount() {
        return TutorDialog.hide(this.props);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        return TutorDialog.update(newProps);
    }

    // The render method doesn't add anything to the DOM
    // instead it shows/hides DetachedTutorDialog
    render() { return null; }

    static show(props) {
        return new Promise((onOk, onCancel) => {
            let div;
            props = extend(
                clone(props),
                {
                    onOk,
                    onCancel,
                    show: true,
                },
            );
            div = (() => {
                if (this.dialog) {
                    return document.body.querySelector('.-tutor-dialog-parent');
                } else {
                    div = document.body.appendChild( document.createElement('div') );
                    div.className = '-tutor-dialog-parent';
                    return div;
                }
            })();

            this.dialog = ReactDOM.render(<DetachedTutorDialog {...props} />, div);
            return this.dialog;
        });
    }

    static hide() {
        return (this.dialog != null ? this.dialog.hide() : undefined);
    }

    static update(props) {
        return (this.dialog != null ? this.dialog.setProps(props) : undefined);
    }
}
