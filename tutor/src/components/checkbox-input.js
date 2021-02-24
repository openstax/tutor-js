import { React, PropTypes, observer, styled } from 'vendor';
import { colors } from 'theme';
import { uniqueId, isEmpty } from 'lodash';
import { useField } from 'formik';
import { Icon } from 'shared';

const StyledWrapper = styled.span`
  position: relative;
`;

const StyledCheckboxInput = styled.input.attrs( () => ({
    type: 'checkbox',
}))`
  opacity: 0;

  & + label {
    ${props => !isEmpty(props.label) && 'margin-left: 1rem;'}
    ${props => props.labelSize === 'lg' && 'font-size: 1.6rem;'}
  }

  && + label svg {
    border: 0;
    content: "";
    left: 0;
    top: 0;
    margin: 0;
    position: absolute;
    height: 1.6rem;
    width: 1.6rem;
  }

  &:disabled + label svg {
    color: ${colors.disabledInputBorder};
  }

  &:focus + label svg {
    box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
  }
`;

const CheckboxInput = observer((props) => {
    const [field] = props.standalone ? [] : useField({ type: 'checkbox', ...props });
    const id = props.id || uniqueId(props.name);

    return (
        <StyledWrapper className={props.className}>
            <StyledCheckboxInput
                {...field}
                {...props}
                id={id}
            />
            <label htmlFor={id}>
                <Icon variant={props.checked ? 'checkedSquare' : 'checkSquare'} size="lg" />
                {props.label}
            </label>
        </StyledWrapper>
    );
});

CheckboxInput.propTypes = {
    name: PropTypes.string,
    labelSize: PropTypes.string,
};

export default CheckboxInput;
