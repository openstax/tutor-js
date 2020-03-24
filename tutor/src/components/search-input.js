import { React, PropTypes, styled, observer } from 'vendor';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { Icon } from 'shared';
import { colors } from 'theme';

const StyledInputGroup = styled(InputGroup)`
  && {
    border: 1px solid ${colors.neutral.pale};
    input {
      border: 0;
      font-size: 1.4rem;

      &::placeholder {
        color: ${colors.neutral.thin};
        font-size: 1.4rem;
      }

      &:focus {
        border-color: ${colors.forms.borders.focus};
        box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
        background: #fff;
      }
    }
  }
`;

const SearchInput = observer(({ onChange }) => {

  return (
    <StyledInputGroup>
      <FormControl
        placeholder="Search by student name"
        onChange={onChange}
      />
      <InputGroup.Append>
        <Button variant="icon"><Icon type="search" /></Button>
      </InputGroup.Append>
    </StyledInputGroup>
  );
});

SearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SearchInput;
