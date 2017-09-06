import React from 'react';
import { ListGroup } from 'react-bootstrap';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { readonly } from 'core-decorators';
import { ReactHelpers } from 'shared';

@observer
export class Choice extends React.PureComponent {

  static propTypes = {
    onClick:    React.PropTypes.func.isRequired,
    className:  React.PropTypes.string,
    children:   React.PropTypes.node,
    active:     React.PropTypes.bool,
    disabled:   React.PropTypes.bool,
    record:     React.PropTypes.any,
  }

  @action.bound
  onClick(ev) {
    this.props.onClick(this.props.record, ev);
  }

  render() {
    return (
      <div
        role="button"
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

@observer
export class Listing extends React.PureComponent {

  @readonly static Choice = Choice;

  render() {
    return (
      <ListGroup className="choices-listing">
        {this.props.children}
      </ListGroup>
    );
  }

}
