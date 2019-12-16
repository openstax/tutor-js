import { React, PropTypes, observer, styled } from 'vendor';
import { useField } from 'formik';
import RCNumberInput from 'rc-input-number';
import { Icon } from 'shared';

const StyledNumberInput = styled(RCNumberInput)`
  margin: 0;
  padding: 0;
  height: 26px;
  font-size: 12px;
  height: 26px;

  border: 1px solid #D9D9D9;
  border-radius: 4px;
  transition: all .3s;

  display: inline-flex;
  flex-direction: row-reverse;
  vertical-align: middle;

  input {
    border: 0;
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
      border-left: 1px solid #D9D9D9;
      height: 100%;
      display: flex;
      align-items: center;
      transition: all .3s;
    }
  }
`;


const NumberInput = observer((props) => {
  const [field] = useField({ type: 'text', ...props });

  return (
    <StyledNumberInput
      {...field}
      {...props}
      upHandler={<Icon type="angle-up" />}
      downHandler={<Icon type="angle-down" />}
      onChange={(nv) => field.onChange({ target: { ...props, value: nv } })}
    />
  );
});

NumberInput.propTypes = {
  name: PropTypes.string.isRequired,
};

export default NumberInput;
