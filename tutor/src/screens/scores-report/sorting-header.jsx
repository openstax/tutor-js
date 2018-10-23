import PropTypes from 'prop-types';
import React from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

export default class SortingHeader extends React.Component {

  static propTypes = {
    onSort:  PropTypes.func.isRequired,
    sortKey: PropTypes.any.isRequired,
    sortState: PropTypes.object.isRequired,
    dataType: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.element,
  }

  @autobind
  onClick() {
    this.props.onSort(this.props.sortKey, this.props.dataType);
  }

  render() {
    const ascDesc = this.props.sortState.asc ? 'is-ascending' : 'is-descending';
    const classNames = classnames('header-cell', 'sortable', this.props.className, {
      [ascDesc]: (this.props.sortState.key === this.props.sortKey) && (this.props.sortState.dataType === this.props.dataType),
    });

    return (
      <div
        data-assignment-type={this.props.type}
        onClick={this.onClick}
        className={classNames}>
        {this.props.children}
      </div>
    );
  }
}
