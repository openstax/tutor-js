import { React, styled, PropTypes, observer, cn } from 'vendor';
import { useField } from 'formik';
import Picker from 'rc-picker';
import { uniqueId, range, defaults } from 'lodash';
import { Time } from '../models'
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

    &.error {
      border-color: red
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

const Error = styled.div`
  color: red;
  margin: 0.5rem;
`;

const DateTimeInput = observer((assignedProps) => {
    const props = defaults({}, assignedProps, {
        type: 'text',
        format: 'MMM D | hh:mm A',
        timeFormat: 'hh:mm A',
    });
    const [field, meta] = useField(props);

    const id = props.id || uniqueId(props.name);
    const LabelWrapper = props.labelWrapper || React.Fragment;

    const momentValue = (value, timezone) => {
        // We sure it's set in the prop timezone before handing off to rc-picker
        const time = new Time(field.value).inZone(props.timezone).asLocal();
        return timezone ? time.asMomentTz : time.asMoment
    }

    // rc-picker needs a moment value
    const timeValue = field.value ? momentValue(field.value, props.timezone) : null

    const onUpdateDate = dt => {
        // If an initial value wasn't passed (to render the field as empty), rc-picker
        // will create a default moment object in the browser's timezone. But if a
        // timezone was also passed (like the course timezone) then we want to discard
        // the browser TZ and treat the selected value as in the prop timezone using
        // asZone (Luxon's keepLocalTime set to true)
        const inputTime = new Time(dt).asZone(props.timezone);
        const ev = { target: { name: field.name, value: inputTime } };
        field.onBlur(ev);
        field.onChange(ev);
        props.onChange && props.onChange(ev);
    };


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
                        hideDisabledOptions: true,
                        format: props.timeFormat || 'hh:mm A',
                    }}
                    //Reference: https://github.com/react-component/picker/blob/master/src/interface.ts#L84
                    //Showing minutes step of 10, and 1 and 59
                    disabledTime={() => {
                        return {
                            disabledMinutes() {
                                return range(1, 60, 1).filter(f => f % 10 !== 0 && f !== 1 && f !== 59);
                            },
                        };
                    }}
                    {...field}
                    {...props}
                    value={timeValue}
                    onSelect={onUpdateDate}
                    onChange={onUpdateDate}
                    prefixCls="oxdt"
                    id={id}
                    autoFocus={props.autoFocus}
                    className={cn({ error: props.errorMessage })}
                />
                <IconWrapper>
                    <Icon type="calendar" />
                </IconWrapper>
            </PickerWrapper>
            {meta.error && meta.touched && <Error>{meta.error}</Error>}
            {props.errorMessage && <Error data-test-id="date-error-message">{props.errorMessage}</Error>}
        </StyledWrapper>
    );
});

DateTimeInput.displayName = 'DateTimeInput';
DateTimeInput.propTypes = {
    name: PropTypes.string.isRequired,
    timezone: PropTypes.string,
};

export default DateTimeInput;
