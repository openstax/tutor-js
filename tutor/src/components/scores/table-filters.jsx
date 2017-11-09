import React from 'react';
import { map } from 'lodash';
import { action } from 'mobx';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { autobind } from 'core-decorators';

const FILTERS = {
  '%': 'percentage',
  '#': 'number',
};

export default class TableFilters extends React.PureComponent {

  static propTypes = {
    displayAs: React.PropTypes.string.isRequired,
    changeDisplayAs: React.PropTypes.func.isRequired,
  }

  @action.bound onFilterChange(mode) {
    this.props.changeDisplayAs(mode);
  }

  @autobind renderButton(filter, label) {
    return (
      <ToggleButton
        value={filter}
        key={filter}
      >
        {label}
      </ToggleButton>
    );
  }

  render() {
    const { displayAs } = this.props;
    return (
      <div className="filter-row">
        Display as
        <ToggleButtonGroup
          value={displayAs}
          onChange={this.onFilterChange}
          bsSize="small"
          name="filter-by"
          className="filter-group"
        >
          {map(FILTERS, this.renderButton)}
        </ToggleButtonGroup>
      </div>
    );
  }
}
