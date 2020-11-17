import { React, PropTypes, styled } from 'vendor';
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
  }
`;

const StyledMenu = styled(Dropdown.Menu)`
  && {
    width: 100%;
    border-radius: 0.4rem;

    .dropdown-item {
      padding: 0.8rem 1rem;
      font-size: 1.4rem;
      color: ${colors.neutral.darker};
    }
  }
`;

const TutorDropdown = ({
  toggleName,
  dropdownItems,
  dropdownTestId = '',
  toggleDataTestId = '',
  disabled = false }) => {
  return (
    <StyledDropdown data-test-id={dropdownTestId}>
      {
        toggleName &&
          <StyledToggle
            variant="outline"
            data-test-id={toggleDataTestId}
            disabled={disabled}>
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
};

export default TutorDropdown;
