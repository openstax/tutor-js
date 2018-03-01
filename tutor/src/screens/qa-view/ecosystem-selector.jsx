import React from 'react';
import { inject, observer, propTypes as mobxPropTypes } from 'mobx-react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import Ecosystems from '../../models/ecosystems';


@observer
export default class EcosystemSelector extends React.Component {

  static propTypes = {
    ux: mobxPropTypes.observableObject.isRequired,
  }

  componentDidMount() {
    Ecosystems.fetch();
  }

  render() {
    return (
      <Dropdown
        id="support-menu"
        className="support-menu"
        pullRight
        onSelect={this.props.ux.onEcosystemSelect}
      >
        <Dropdown.Toggle
          useAnchor={true}
        >
          Select Ecosystem
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Ecosystems.array.map(ec => (
            <MenuItem key={ec.id} eventKey={ec.id}>
              {ec.book.titleWithVersion}
            </MenuItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }


}
