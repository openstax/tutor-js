import PropTypes from 'prop-types';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { readonly } from 'core-decorators';
import { ReactHelpers } from 'shared';

export
@observer
 class Choice extends React.Component {

  static propTypes = {
    onClick:    PropTypes.func.isRequired,
    className:  PropTypes.string,
    children:   PropTypes.node,
    active:     PropTypes.bool,
    disabled:   PropTypes.bool,
    record:     PropTypes.any,
  }

  @action.bound
  onClick(ev) {
    this.props.onClick(this.props.record, ev);
  }

  render() {
    return (
      <div
        role="button"
        aria-pressed={this.props.active}
        {...ReactHelpers.filterProps(this.props)}
        className={classnames('list-group-item', 'choice', this.props.className, {
            active: this.props.active, disabled: this.props.disabled,
        })}
        onClick={this.onClick}
      >
        {this.props.children}
      </div>
    );
  }
}

export
@observer
 class Listing extends React.Component {

  @readonly static Choice = Choice;

  render() {
    return (
      <ListGroup className="choices-listing">
        {this.props.children}
      </ListGroup>
    );
  }

}
