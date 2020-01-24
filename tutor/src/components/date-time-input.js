import { React, styled, PropTypes, observer } from 'vendor';
import { useField } from 'formik';
import Picker from 'rc-picker';
import { uniqueId } from 'lodash';
import moment from 'moment';
import locale from 'rc-picker/lib/locale/en_US';
import generateConfig from 'rc-picker/lib/generate/moment';
import 'rc-picker/assets/index.css';

const StyledWrapper = styled.span`
  position: relative;
`;

const DateTimeInput = observer((props) => {
  const [field, meta] = useField({ type: 'text', ...props });
  const id = props.id || uniqueId(props.name);

  return (
    <StyledWrapper>
      {props.label && <label htmlFor={id}>{props.label}</label>}
      <Picker
        locale={locale}
        generateConfig={generateConfig}
        showToday
        showTime={{
          showSecond: false,
          use12Hours: true,
          minuteStep: 10,
        }}
        {...field}
        {...props}
        value={field.value ? moment(field.value) : null}
        onChange={dt => {
          const ev = { target: { name: field.name, value: dt } };
          field.onChange(ev);
          props.onChange && props.onChange(ev);
        }}
        prefixCls="oxdt"
        id={id}
      />
      {meta.error && meta.touched && <div>{meta.error}</div>}
    </StyledWrapper>
  );
});

DateTimeInput.displayName = 'DateTimeInput';
DateTimeInput.propTypes = {
  name: PropTypes.string.isRequired,
};

export default DateTimeInput;
