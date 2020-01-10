import { React, PropTypes, observer, styled } from 'vendor';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { colors } from '../theme';
import Select from './select';
import { useField } from 'formik';
import { range } from 'lodash';

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

const TimeSeparator = styled.span `
  margin: 0 0.5rem;
  font-weight: bold;
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  margin-left: 1.4rem;
  border: 1px solid ${colors.forms.borders.light};
  border-radius: 4px;

  &.btn-group {
    vertical-align: initial;
  }

  .btn:not(.btn-link) {
    font-size: 1.4rem;
    height: 3.1rem;
    background-color: #fff;

    &:not(.disabled) {
      &.active {
        background: ${colors.neutral.light};
        border-color: ${colors.neutral.light};
      }

      &.focus {
        border-color: ${colors.forms.borders.focus};
        box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
      }
    }
  }
`;

const EXTRACT = /(\d+):(\d+)/;

const TimeInput = observer(( props ) => {

  const [ field ] = useField(props);
  const { name } = props;

  let parts = (field.value || '').toString().match(EXTRACT) || [null, 0, 0];
  let [_, hour, minute] = parts;
  hour = parseInt(hour);
  minute = parseInt(minute);

  const isAM = hour < 12;
  const onChange = (h, m) => {
    const ev = {
      target: {
        name: props.name,
        value: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
      },
    };
    field.onChange(ev);
    props.onChange && props.onChange(ev);
  };

  return (
    <Wrapper>
      <Select
        value={isAM ? hour : hour - 12}
        name={`${name}_hour`}
        onChange={ev => onChange(ev.target.value, minute)}
      >
        {range(1, 13).map((h) => <option value={h} key={h}>{h}</option>)}
      </Select>
      <TimeSeparator>:</TimeSeparator>
      <Select
        value={minute}
        name={`${name}_minute`}
        onChange={ev => onChange(hour, ev.target.value)}
      >
        {range(1, 61).map((m) =>
          <option value={m} key={m}>{`${m}`.padStart(2, '0')}</option>
        )}
      </Select>
      <StyledToggleButtonGroup
        type="radio"
        name={`${name}_ampm`}
        value={isAM ? 'am' : 'pm'}
        onChange={(ampm) => {
          const newHour = hour + ('am' == ampm ? -12 : 12);
          onChange(newHour, minute);
        }}
      >
        <ToggleButton value="am" variant="light">AM</ToggleButton>
        <ToggleButton value="pm" variant="light">PM</ToggleButton>
      </StyledToggleButtonGroup>
    </Wrapper>
  );
});
TimeInput.propTypes = {
  name: PropTypes.string.isRequired,
};
export default TimeInput;
