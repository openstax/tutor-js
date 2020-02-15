import { React, PropTypes, observer, styled } from 'vendor';
import Theme from '../theme';
import { uniqueId } from 'lodash';
import { useField } from 'formik';

const StyledWrapper = styled.span`
  position: relative;
`;

const StyledRadioInput = styled.input.attrs( () => ({
  type: 'radio',
}))`
  opacity: 0;

  & + label {
    margin-left: 1.4rem;
    ${props => props.labelSize === 'lg' && 'font-size: 1.6rem;'}
  }

  & + label::before {
    border: 0.1rem solid #5E6062;
    content: "";
    left: 0;
    top: 0;
    position: absolute;
    height: 1.6rem;
    width: 1.6rem;
    border-radius: 50%;
  }

  & + label::after {
    content: "";
    opacity: 0;
    border: 0.5rem solid ${Theme.colors.primary};
    border-radius: 50%;
    position: absolute;
    left: 0.3rem;
    top: 0.3rem;
    transition: opacity 0.2s ease-in-out;
  }

  &:checked  {
    & + label::before {
      border-color: ${Theme.colors.primary};
    }
    & + label::after {
      opacity: 1;
    }
  }

  &:focus + label::before {
    border-color: ${Theme.colors.forms.borders.focus};
    box-shadow: 0 0 4px 0 ${Theme.colors.forms.borders.focusShadow};
  }
`;

const RadioInput = observer((props) => {
  const [field] = useField({ type: 'text', ...props });
  const id = props.id || uniqueId(props.name);

  return (
    <StyledWrapper>
      <StyledRadioInput
        {...field}
        {...props}
        id={id}
      />
      <label htmlFor={id}>{props.label}</label>
    </StyledWrapper>
  );
});

RadioInput.propTypes = {
  name: PropTypes.string.isRequired,
  labelSize: PropTypes.string,
};

export default RadioInput;
