import React from 'react';
import { map } from 'lodash';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import UX from './ux';

const FILTERS = {
  '%': 'percentage',
  '#': 'number',
};

@observer
export default class TableFilters extends React.PureComponent {

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
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
    const { ux } = this.props;
    return (
      <div className="filter-row">
        Display as
        <ToggleButtonGroup
          value={ux.displayValuesAs}
          onChange={ux.onChangeDisplayValuesAs}
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
