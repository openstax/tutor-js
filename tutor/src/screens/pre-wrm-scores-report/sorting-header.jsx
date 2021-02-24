import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Theme from '../../../src/theme';
import { Icon } from 'shared';
import UX from './ux';

@observer
export default
class SortingHeader extends React.Component {

  static propTypes = {
      ux: PropTypes.instanceOf(UX).isRequired,
      sortKey: PropTypes.any.isRequired,
      className: PropTypes.string,
      dataType: PropTypes.string,
      type: PropTypes.string,
      children: PropTypes.element,
  }

  @autobind
  onClick() {
      this.props.ux.changeSortingOrder(this.props.sortKey, this.props.dataType);
  }

  render() {
      const { ux } = this.props;
      const isSorted = ux.isSortedBy(this.props);
      const ascDesc = ux.sort.asc ? 'is-ascending' : 'is-descending';
      const classNames = classnames('header-cell', 'sortable', this.props.className, {
          [ascDesc]: isSorted,
      });

      return (
          <div
              data-assignment-type={this.props.type}
              onClick={this.onClick}
              className={classNames}
          >
              <Icon
                  type={isSorted ? `sort-${ux.sort.asc ? 'up' : 'down'}` : 'sort'}
                  color={isSorted ? Theme.colors.states.active : Theme.colors.states.disabled}
              />
              {this.props.children}
          </div>
      );
  }
}
