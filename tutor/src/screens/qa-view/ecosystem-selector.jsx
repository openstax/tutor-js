import React from 'react';
import { inject, observer, propTypes as mobxPropTypes } from 'mobx-react';
import { Dropdown, MenuItem } from 'react-bootstrap';

@observer
export default class EcosystemSelector extends React.Component {

  static propTypes = {
    ux: mobxPropTypes.observableObject.isRequired,
  }

  componentDidMount() {
    this.props.ux.ecosystemsMap.fetch();
  }

  render() {

    const { ux } = this.props;
    return (
      <Dropdown
        id="support-menu"
        className="support-menu"
        pullRight
        onSelect={ux.onEcosystemSelect}
      >
        <Dropdown.Toggle
          useAnchor={true}
        >
          Select Ecosystem
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {ux.ecosystemsMap.array.map(ec => (
            <MenuItem key={ec.id} eventKey={ec.id}>
              {ec.book.titleWithVersion}
            </MenuItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }


}
