import { React, PropTypes, useObserver, styled, observable } from 'vendor';
import { createRef } from 'react';
import { Button, Popover, Overlay } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { Icon } from 'shared';
import { colors } from 'theme';
import UX from './ux';

/** https://www.w3schools.com/howto/howto_css_custom_checkbox.asp  */
const StyledCheckbox = styled.label`
  display: block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;

/* Hide default checkbox */
& input {
  position: absolute;
  cursor: pointer;
  height: 0;
  width: 0;
}

.check {
  position: absolute;
  top: 2px;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: ${colors.white};
  border: 2px solid ${colors.neutral.pale};
}

& input:checked ~ .check:after {
  display: block;
}

/* Style the check */
& .check:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid ${colors.neutral.dark};
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}
`;

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
  <StyledCheckbox>
    {title}
    <input
      type="checkbox"
      checked={ux[property]}
      onChange={({ target }) => ux[property] = target.checked}
    />
    <span className="check"></span>
  </StyledCheckbox>
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