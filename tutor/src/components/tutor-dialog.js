let TutorDialog;
import BS from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import { Promise } from 'es6-promise';


const DialogProperties = {
  title:         PropTypes.string.isRequired,
  onOk:          PropTypes.func.isRequired,
  onCancel:      PropTypes.func.isRequired,
  body:          PropTypes.any.isRequired,
  show:          PropTypes.bool,
  buttons:       PropTypes.arrayOf( PropTypes.element ),
  okBtnText:     PropTypes.string,
  cancelBtnText: PropTypes.string,
  className:     PropTypes.string,
};

// This is the "real" dialog component. It's rendered to a div under document.body
class DetachedTutorDialog extends React.Component {
  static displayName = 'DetachedTutorDialog';
  static propTypes = DialogProperties;
  state = { show: true };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.show != null) { return this.setState({ show: nextProps.show }); }
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
      <BS.Button
        key="ok"
        className="ok"
        onClick={_.compose(this.props.onOk, this._hide)}
        bsStyle="primary">
        {this.props.okBtnText || 'OK'}
      </BS.Button>,
      <BS.Button
        key="cancel"
        className="cancel"
        onClick={_.compose(this.props.onCancel, this._hide)}>
        {this.props.cancelBtnText || 'Cancel'}
      </BS.Button>,
    ];
    const classes = ['tutor-dialog'];
    if (this.props.className) { classes.push(this.props.className); }

    return (
      <BS.Modal className={classes.join(' ')} show={this.state.show} onHide={this.hide}>
        <BS.Modal.Header closeButton={true}>
          <BS.Modal.Title>
            {this.props.title}
          </BS.Modal.Title>
        </BS.Modal.Header>
        <div className="modal-body">
          {this.props.body}
        </div>
        <div className="modal-footer">
          {buttons}
        </div>
      </BS.Modal>
    );
  }
}

export default (TutorDialog = createReactClass({
  displayName: 'TutorDialog',
  propTypes: _.omit(DialogProperties, 'body'),

  componentDidMount() {
    // While unlikely, the onOk and onCancel properties could have been updated while the dialog was visible
    // If they were we need to call their current functions
    return TutorDialog.show(_.extend({}, this.props, { body: this.props.children })).then(
      ( function() { return (typeof this.props.onOk === 'function' ? this.props.onOk(...arguments) : undefined);  }.bind(this)) , ( typeof this.props.onCancel === 'function' ? this.props.onCancel(...arguments) : undefined)
    );
  },

  componentWillUnmount() {
    return TutorDialog.hide(this.props);
  },

  UNSAFE_componentWillReceiveProps(newProps) {
    return TutorDialog.update(newProps);
  },

  // The render method doesn't add anything to the DOM
  // instead it shows/hides DetachedTutorDialog
  render() { return null; },

  statics: {
    show(props) {
      return new Promise((onOk, onCancel) => {
        let div;
        props = _.extend(
          _.clone(props),
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
    },

    hide() {
      return (this.dialog != null ? this.dialog.hide() : undefined);
    },

    update(props) {
      return (this.dialog != null ? this.dialog.setProps(props) : undefined);
    },
  },
}));
