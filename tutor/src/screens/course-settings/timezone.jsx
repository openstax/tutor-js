import { React, PropTypes, observable, observer, action, modelize } from 'vendor';
import { Dropdown } from 'react-bootstrap';
import TimeHelper from '../../helpers/time';
import TutorDropdown from '../../components/dropdown';

@observer
class Timezone extends React.Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
    }

    @observable showModal = false

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onOpen() {
        this.showModal = true;
    }
    @action.bound onClose() {
        this.showModal = false;
    }

    render() {
        const timezones = TimeHelper.getTimezones();
        const { value, onChange, disabled } = this.props;
        return (
            <TutorDropdown
                dropdownTestId='timezone-dropdown'
                toggleName={value}
                disabled={disabled}
                dropdownItems={timezones.map((tz, i) => (
                    <Dropdown.Item
                        key={i}
                        value={tz}
                        eventKey={tz}
                        onSelect={(value) => onChange(value)}>
                        {tz}
                    </Dropdown.Item>))}
            />
        );
    }
}

export default Timezone