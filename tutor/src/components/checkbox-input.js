import { React, PropTypes, observer, styled } from 'vendor';
import { colors } from 'theme';
import { uniqueId, isEmpty, pick, omit } from 'lodash';
import { useField } from 'formik';
import { Icon } from 'shared';

const StyledWrapper = styled.span`
  position: relative;
  line-height: 1;
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
    const wrapperProps = pick(props, ['className', 'data-test-id'])
    const innerProps = omit(props, 'data-test-id')
    const [field] = innerProps.standalone ? [] : useField({ type: 'checkbox', ...innerProps });
    const id = innerProps.id || uniqueId(innerProps.name);

    return (
        <StyledWrapper {...wrapperProps}>
            <StyledCheckboxInput
                {...field}
                {...innerProps}
                id={id}
            />
            <label htmlFor={id}>
                <Icon variant={innerProps.checked ? 'checkedSquare' : 'checkSquare'} size="lg" />
                {innerProps.label}
            </label>
        </StyledWrapper>
    );
});

CheckboxInput.propTypes = {
    name: PropTypes.string,
    labelSize: PropTypes.string,
};

export default CheckboxInput;
