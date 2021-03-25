import { React, PropTypes, styled, observable, observer, action } from 'vendor';
import { createRef } from 'react';
import { map } from 'lodash';
import { Button, Popover, Overlay } from 'react-bootstrap';
import { Icon } from 'shared';
import { colors } from 'theme';

/** https://www.w3schools.com/howto/howto_css_custom_checkbox.asp  */
const StyledCheckbox = styled.label`
  display: block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;

  /* Hide default checkbox */
  input {
    position: absolute;
    cursor: pointer;
    visibility: hidden;
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

const MoreInfo = styled.p`
  color: ${colors.neutral.thin};
  border-top: 1px solid ${colors.neutral.gray};
`;

const SettingsCheckbox = observer(({ ux, title, property }) => (
    <StyledCheckbox data-test-id={`${property}-checkbox`}>
        {title}
        <input
            type="checkbox"
            checked={ux[property]}
            onChange={({ target }) => ux[property] = target.checked}
        />
        <span className="check"></span>
    </StyledCheckbox>
));
SettingsCheckbox.propTypes = {
    ux: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
};

@observer
export default class Settings extends React.Component {
    static propTypes = {
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

    @action.bound onMouseEnter() {
        this.showPopoverInfo = true;
    }

    @action.bound onMouseLeave() {
        this.showPopoverInfo = false;
    }

    render() {
        const { ux, label, controls, moreInfo } = this.props;
        return (
            <>
                <Button
                    ref={this.target}
                    data-test-id="settings-btn"
                    onClick={this.onBtnClick}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    variant='plain'
                    className={`${this.showPopoverSettings ? 'gradebook-btn-selected' : ''}`}
                >
                    <Icon type="cog" />
                </Button>
                {/* Overlay for the settings controller */}
                <Overlay
                    rootClose
                    target={this.target.current}
                    placement="bottom"
                    show={this.showPopoverSettings}
                    onHide={() => this.showPopoverSettings = false}>
                    <Popover className="scores-popover" >
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
                    <Popover className="scores-popover" >
                        <p>{label}</p>
                    </Popover>
                </Overlay>
            </>
        );
    }
}
