import { React, PropTypes, styled, observable, observer, action } from 'vendor';
import { createRef } from 'react';
import { map } from 'lodash';
import { Button, Popover, Overlay } from 'react-bootstrap';
import { Icon } from 'shared';
import { colors } from 'theme';


const Toggles = styled(Popover.Content)`
  padding: 1rem;
  label {
    display: block;
  }
  input {
    margin-right: 1rem;
  }
`;

const MoreInfo = styled.p`
  color: ${colors.neutral.thin};
  border-top: 1px solid ${colors.neutral.gray};
`;

const SettingsCheckbox = observer(({ ux, title, property }) => (
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
  ux: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
};
  
export default
@observer
class Settings extends React.Component {
  static propTypes ={
    ux: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    controls: PropTypes.object.isRequired,
    moreInfo: PropTypes.string,
  };

  target = createRef();
  @observable showPopoverInfo = false;
  @observable showPopoverSettings = false;

  @action.bound onBtnClick() {
    this.showPopoverInfo = false;
    this.showPopoverSettings = true;
  }

  @action.bound onMouseEnter(){
    this.showPopoverInfo = true;
  }

  @action.bound onMouseLeave() {
    this.showPopoverInfo = false;
  }
  
  render () {
    const { ux, label, controls, moreInfo } = this.props;
    return (
      <>
        <Button ref={this.target}
          onClick={this.onBtnClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
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
              {map(controls, (title, property) => <SettingsCheckbox key={property} ux={ux} property={property} title={title} />)}
            </Toggles>
            {moreInfo && <MoreInfo>{moreInfo}</MoreInfo>}
          </Popover>
        </Overlay>
        {/* Overlay for the button information */}
        <Overlay
          target={this.target.current}
          placement="bottom"
          show={this.showPopoverInfo && !this.showPopoverSettings}>
          <Popover className="gradebook-popover" >  
            <p>{label}</p>
          </Popover>
        </Overlay>
      </>
    );
  }
}
