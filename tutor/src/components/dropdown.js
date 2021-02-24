import { React, PropTypes, styled, useRef, useEffect, cn } from 'vendor';
import { Dropdown } from 'react-bootstrap';
import { TruncatedText } from './text';
import { colors } from 'theme';

const StyledDropdown = styled(Dropdown)`
  display: inline-flex;
  .dropdown-item {
    white-space: break-spaces;
  }
`;

const StyledToggle = styled(Dropdown.Toggle)`
  &&& {
    border: 1px solid ${colors.forms.borders.light};
    color: ${colors.neutral.darker};
    background: #fff;
    height: 3.4rem;
    width: 25rem;
    text-align: left;
    padding: 0 1rem;
    font-size: 1.4rem;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    appearance: none;
    border-radius: 0.4rem;

    &:focus {
      border-color: ${colors.forms.borders.focus};
      box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
    }

    &:after {
      color: ${colors.neutral.std};
      flex-basis: 0;
      font-size: 24px;
    }

    &.has-error {
      border-color: ${colors.soft_red};
      background-color: ${colors.gray_red};
    }
  }
`;

const StyledMenu = styled(Dropdown.Menu)`
  && {
    min-width: 100%;
    border-radius: 0.4rem;

    .dropdown-item {
      padding: 0.8rem 1rem;
      font-size: 1.6rem;
      line-height: 2.4rem;
      color: ${colors.neutral.darker};
      text-overflow: ellipsis;
      max-width: 400px;
      overflow: hidden;
      white-space: nowrap;
    }
  }
`;

const TutorDropdown = ({
    toggleName,
    dropdownItems,
    dropdownTestId = '',
    toggleDataTestId = '',
    disabled = false,
    shouldBeFocus = false,
    hasError = false }) => {
    const dropdownRef = useRef();
    useEffect(() => {
        if(dropdownRef && dropdownRef.current) {
            dropdownRef.current.focus();
        }
    }, []);
    return (
        <StyledDropdown data-test-id={dropdownTestId}>
            {
                toggleName &&
          <StyledToggle
              type="button"
              variant="outline"
              className={cn({ 'has-error': hasError })}
              data-test-id={toggleDataTestId}
              disabled={disabled}
              ref={shouldBeFocus ? dropdownRef : null}>
              <TruncatedText maxWidth="25rem">{toggleName}</TruncatedText>
          </StyledToggle>
            }
            <StyledMenu>
                {dropdownItems}
            </StyledMenu>
        </StyledDropdown>
    );
};
TutorDropdown.propTypes = {
    toggleName: PropTypes.string,
    dropdownTestId: PropTypes.string,
    toggleDataTestId: PropTypes.string,
    disabled: PropTypes.bool,
    dropdownItems: PropTypes.node.isRequired,
    shouldBeFocus: PropTypes.bool,
    hasError: PropTypes.bool,
};

export default TutorDropdown;
