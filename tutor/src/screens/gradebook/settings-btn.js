import { React, PropTypes, useObserver, styled } from 'vendor';
import { createRef } from 'react';
import { Button, Popover, Overlay } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { Icon } from 'shared';
import UX from './ux';
import { observable } from 'mobx';


const Toggles = styled(Popover.Content)`
  padding: 1rem;
  label {
    display: block;
  }
  input {
    margin-right: 1rem;
  }
`;

const SettingsCheckbox = ({ ux, title, property }) => useObserver(() => (
  <label>
    <input
      type="checkbox"
      checked={ux[property]}
      onChange={({ target }) => ux[property] = target.checked}
    />
    {title}
  </label>
));
SettingsCheckbox.propTypes ={
  ux: PropTypes.instanceOf(UX).isRequired,
  title: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
};
  
export default
@observer
class Settings extends React.Component {
  static propTypes ={
    ux: PropTypes.instanceOf(UX).isRequired,
  };

  target = createRef();
  @observable showPopoverInfo = false;
  @observable showPopoverSettings = false;

  render () {
    const { ux } = this.props;
    return (
      <>
        <Button ref={this.target}
          onClick={() => {
            this.showPopoverInfo = false;
            this.showPopoverSettings = true;
          }}
          onMouseEnter={() => 
            this.showPopoverInfo = true
          }
          onMouseLeave={() => 
            this.showPopoverInfo = false
          }
          variant='plain'
          className={`${this.showPopoverSettings ? 'gradebook-btn-selected' : ''}`}>
          <Icon type="cog" />
        </Button>
        {/* Overlay for the settings controller */}
        <Overlay
          rootClose
          target={this.target.current}
          placement="bottom"
          show={this.showPopoverSettings}
          onHide={() => this.showPopoverSettings = false }>
          <Popover className="gradebook-popover" >
            <Toggles>
              <SettingsCheckbox ux={ux} property="displayScoresAsPercent" title="Display scores as percentage %" />
              <SettingsCheckbox ux={ux} property="arrangeColumnsByType" title="Arrange columns by assignment type" />
              <SettingsCheckbox ux={ux} property="arrangeColumnsByPoints" title="Arrange columns by points" />
              <SettingsCheckbox ux={ux} property="showDroppedStudents" title="Show dropped students" />
            </Toggles> 
          </Popover>
        </Overlay>
        {/* Overlay for the button information */}
        <Overlay
          target={this.target.current}
          placement="bottom"
          show={this.showPopoverInfo && !this.showPopoverSettings}>
          <Popover className="gradebook-popover" >  
            <p>Adjust table display settings</p>
          </Popover>
        </Overlay>
      </>
    );
  }
}