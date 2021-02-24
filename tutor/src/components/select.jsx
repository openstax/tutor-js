import { React, PropTypes, observer, styled } from 'vendor';
import { Icon } from 'shared';
import Theme from '../theme';
import { useField } from 'formik';

const SelectWrapper = styled.span`
  position: relative;
  display: inline-flex;

  .ox-icon {
    position: absolute;
    right: 0.45rem;
    top: 0.9rem;
    color: ${Theme.colors.neutral.std};
    pointer-events: none;
  }
`;

const StyledSelect = styled.select.attrs( () => ({

}))`
  border: 1px solid ${Theme.colors.forms.borders.light};
  color: ${Theme.colors.neutral.dark};
  background: #fff;
  height: 3.3rem;
  padding: 0 2.5rem 0 1rem;
  font-size: 1.4rem;
  display: inline-flex;
  border-radius: 4px;
  appearance: none;

  &:focus {
    border-color: ${Theme.colors.forms.borders.focus};
    box-shadow: 0 0 4px 0 ${Theme.colors.forms.borders.focusShadow};
  }
`;

const Select = observer((props) => {
    const [ field ] = useField({ type: 'select', ...props });

    return (
        <SelectWrapper>
            <StyledSelect
                {...field}
                {...props}
            />
            <Icon type="caret-down" />
        </SelectWrapper>
    );
});

Select.propTypes = {
    name: PropTypes.string.isRequired,
};

export default Select;
