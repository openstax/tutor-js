import { React, styled, PropTypes, useObserver, cn } from 'vendor';
import { useField } from 'formik';
import Picker from 'rc-picker';
import { uniqueId } from 'lodash';
import moment from 'moment';
import locale from 'rc-picker/lib/locale/en_US';
import generateConfig from 'rc-picker/lib/generate/moment';
import 'rc-picker/assets/index.css';
import { Icon } from 'shared';
import { colors } from '../theme';

const StyledWrapper = styled.div`
  position: relative;
`;

const Label = styled.label`
  font-weight: bold;
`;

const PickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledPicker = styled(Picker)`
  && {
    padding: 0;
    border-radius: 4px;
    flex-basis: 100%;

    input {
      padding-left: 1.2rem;
      padding-right: 3rem;
      height: 4rem;
    }

    &.oxdt-focused {
      border-color: ${colors.forms.borders.focus};
      box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
    }
  }
`;

const IconWrapper = styled.div`
  width: 3.3rem;
  z-index: 1;
  pointer-events: none;
  background: ${colors.neutral.bright};
  border-left: 1px solid ${colors.neutral.pale};
  position: absolute;
  top: 1px;
  bottom: 1px;
  right: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 4px 4px 0;
`;


const DateTimeInput = (props) => useObserver(() => {
  const [field, meta] = useField({ type: 'text', ...props });
  const id = props.id || uniqueId(props.name);
  const LabelWrapper = props.labelWrapper || React.Fragment;

  return (
    <StyledWrapper className={cn('date-time-input', props.className)}>
      <LabelWrapper>
        {props.label && <Label htmlFor={id}>{props.label}</Label>}
      </LabelWrapper>
      <PickerWrapper>
        <StyledPicker
          locale={locale}
          generateConfig={generateConfig}
          format={props.format}
          showToday
          showTime={{
            showSecond: false,
            use12Hours: true,
            minuteStep: 10,
            format: 'hh:mm A',
          }}
          {...field}
          {...props}
          value={field.value ? moment(field.value) : null}
          onSelect={dt => {
            const ev = { target: { name: field.name, value: dt } };
            field.onChange(ev);
            props.onChange && props.onChange(ev);
          }}
          prefixCls="oxdt"
          id={id}
          autoFocus={props.autoFocus}
        />
        <IconWrapper>
          <Icon type="calendar" />
        </IconWrapper>
        {meta.error && meta.touched && <div>{meta.error}</div>}
      </PickerWrapper>
    </StyledWrapper>
  );
});

DateTimeInput.displayName = 'DateTimeInput';
DateTimeInput.propTypes = {
  name: PropTypes.string.isRequired,
};

export default DateTimeInput;
