import { React, PropTypes, observer, styled } from 'vendor';
import { useField } from 'formik';
import RCNumberInput from 'rc-input-number';
import { Icon } from 'shared';
import Theme from '../theme';

const StyledNumberInput = styled(RCNumberInput)`
  margin: 0;
  padding: 0;
  height: 3.3rem;
  font-size: 1.4rem;
  line-height: 1.6rem;

  border: 1px solid ${Theme.colors.forms.borders.light};
  border-radius: 4px;
  transition: all .3s;

  display: inline-flex;
  flex-direction: row-reverse;
  vertical-align: middle;

  &.rc-input-number-focused {
    border-color: ${Theme.colors.forms.borders.focus};
    box-shadow: 0 0 4px 0 ${Theme.colors.forms.borders.focusShadow};
  }

  input {
    border: 0;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    text-align: right;
    padding-right: 0.8rem;
  }

  .rc-input-number-input-wrap {
    flex: 1;
    display: flex;
  }

  .rc-input-number-handler {
    &-down-disabled,
    &-up-disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    &-wrap {
      border-left: 1px solid ${Theme.colors.forms.borders.light};
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      transition: all .3s;
    }
  }

  .ox-icon {
    color: ${Theme.colors.neutral.std};
  }
`;


const NumberInput = observer((props) => {
  const [field] = useField({ type: 'text', ...props });

  let onChange = (nv) => {
    const ev = { target: { ...props, value: nv } };
    field.onChange(ev);
    props.onChange && props.onChange(ev);
  };

  let value = field.value;

  if (props.translate) {
    value = props.translate.fromNumber(value);
    const defaultOnChange = onChange;
    onChange = (nv) => defaultOnChange(props.translate.toNumber(nv));
  }

  return (
    <StyledNumberInput
      {...field}
      {...props}
      value={value}
      upHandler={<Icon type="caret-up" />}
      downHandler={<Icon type="caret-down" />}
      onChange={onChange}
    />
  );
});

NumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  translate: PropTypes.shape({
    fromNumber: PropTypes.func,
    toNumber: PropTypes.func,
  }),
};

export default NumberInput;
