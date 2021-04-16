import { React, action, observer, modelize } from 'vendor';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { map } from 'lodash';

import TimeHelper from '../../helpers/time';
import BuilderUX from './ux';

@observer
export default
class CourseName extends React.Component {
    static title = 'Choose a name for your course …';
    static propTypes = {
        ux: PropTypes.instanceOf(BuilderUX).isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound
    updateName(ev) {
        this.props.ux.newCourse.name = ev.target.value;
    }

    @action.bound
    updateTimeZone(ev) {
        this.props.ux.newCourse.timezone = ev.target.value;
    }

    render() {
        const { ux: { onKeyPress, newCourse } } = this.props;
        const timezones = TimeHelper.getTimezones();

        return (
            <Form>
                <Form.Group className="course-details-name">
                    <Form.Control
                        autoFocus
                        onKeyPress={onKeyPress}
                        type="text"
                        defaultValue={newCourse.name}
                        placeholder="Choose a name for your course"
                        onChange={this.updateName}
                    />
                </Form.Group>
                <Form.Group className="course-details-sections">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Time zone</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            as="select"
                            placeholder="select"
                            value={newCourse.timezone}
                            onChange={this.updateTimeZone}
                        >
                            {map(timezones, timezone =>
                                <option key={timezone} value={timezone}>{timezone}</option>)}
                        </Form.Control>
                    </InputGroup>
                </Form.Group>
            </Form>
        );
    }
}
