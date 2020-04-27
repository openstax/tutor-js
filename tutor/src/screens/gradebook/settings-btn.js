import { React, PropTypes, useState, useRef, useObserver, styled } from 'vendor';
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
  const [showPopover, setShowPopover] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const target = useRef(null);
  
  return useObserver(() => {
    return (
      <>
        <Button ref={target}
          onClick={() => {
            setShowPopover(false);
            setShowSettings(true);
          }}
          onMouseEnter={() => 
            setShowPopover(true)
          }
          onMouseLeave={() => 
            setShowPopover(false)
          }
          variant='plain'
          className={`${showPopover ? 'gradebook-btn-selected' : ''}`}>
          <Icon type="cog" />
        </Button>
        {/* Overlay for the settings controller */}
        <Overlay
          rootClose
          target={target.current}
          placement="bottom"
          show={showSettings}
          onHide={() => setShowSettings(false)}>
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
          show={showPopover}>
          <Popover className="gradebook-popover" >  
            <p>Adjust table display settings</p>
          </Popover>
        </Overlay>
      </>
    );
  });
};

export default Settings;