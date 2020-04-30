import { React, PropTypes, useRef, useObserver, styled } from 'vendor';
import { Button, Popover, Overlay } from 'react-bootstrap';
import { Icon } from 'shared';
import UX from './ux';

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
  
const Settings = ({ ux }) => {
  const target = useRef(null);
  
  return useObserver(() => {
    return (
      <>
        <Button ref={target}
          onClick={() => {
            ux.hideSettingsInfo();
            ux.showSettings();
          }}
          onMouseEnter={() => 
            ux.showSettingsInfo()
          }
          onMouseLeave={() => 
            ux.hideSettingsInfo()
          }
          variant='plain'
          className={`${ux.showSettingsInfoPopover ? 'gradebook-btn-selected' : ''}`}>
          <Icon type="cog" />
        </Button>
        {/* Overlay for the settings controller */}
        <Overlay
          rootClose
          target={target.current}
          placement="bottom"
          show={ux.showSettingsPopover}
          onHide={() => ux.hideSettings()}>
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
          target={target.current}
          placement="bottom"
          show={ux.showSettingsInfoPopover}>
          <Popover className="gradebook-popover" >  
            <p>Adjust table display settings</p>
          </Popover>
        </Overlay>
      </>
    );
  });
};

export default Settings;