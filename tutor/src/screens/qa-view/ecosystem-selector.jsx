import { React, PropTypes, observer } from 'vendor';
import { Dropdown } from 'react-bootstrap';

@observer
export default
class EcosystemSelector extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
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
        onSelect={ux.onEcosystemSelect}
      >
        <Dropdown.Toggle
          variant="ox"
        >
          {(ux.ecosystem && ux.ecosystem.book.titleWithVersion) || 'Select Ecosystem'}
        </Dropdown.Toggle>
        <Dropdown.Menu alignRight>
          {ux.ecosystemsMap.array.map(ec => (
            ec.book && (
              <Dropdown.Item key={ec.id} eventKey={ec.id}>
                {ec.book.id}: {ec.book.titleWithVersion}
              </Dropdown.Item>
            )))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }


}
