import { React, PropTypes, observer, styled } from 'vendor';
import { uniqueId, isEmpty, pick, omit } from 'lodash';
import { useField } from 'formik';
import { colors } from 'theme';

const StyledWrapper = styled.span`
  position: relative;
`;

const StyledRadioInput = styled.input.attrs( () => ({
    type: 'radio',
}))`
  opacity: 0;

  & + label {
    ${props => !isEmpty(props.label) && 'padding-left: 1.4rem;'}
    ${props => props.labelSize === 'lg' && 'font-size: 1.6rem;'}
  }

  & + label::before {
    border: 0.1rem solid ${colors.neutral.grayblue};
    background: #fff;
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
    border: 0.5rem solid ${colors.primary};
    border-radius: 50%;
    position: absolute;
    left: 0.3rem;
    top: 0.3rem;
    transition: opacity 0.2s ease-in-out;
  }

  &:checked  {
    & + label::before {
      border-color: ${colors.primary};
    }
    & + label::after {
      opacity: 1;
    }
  }

  &:disabled  {
    & + label::before {
      border-color: ${colors.disabledInputBorder};
    }
  }

  &:focus + label::before {
    border-color: ${colors.forms.borders.focus};
    box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
  }
`;

const RadioInput = observer((props) => {
    const wrapperProps = pick(props, 'data-test-id')
    const innerProps = omit(props, 'data-test-id')
    const [field] = innerProps.standalone ? [] : useField({ type: 'text', ...innerProps });
    const id = innerProps.id || uniqueId(innerProps.name);

    return (
        <StyledWrapper {...wrapperProps}>
            <StyledRadioInput
                {...field}
                {...innerProps}
                id={id}
            />
            <label htmlFor={id}>{innerProps.label}</label>
        </StyledWrapper>
    );
});

RadioInput.propTypes = {
    name: PropTypes.string.isRequired,
    labelSize: PropTypes.string,
};

export default RadioInput;
