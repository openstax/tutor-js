import { React, action, observer } from 'vendor';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { map } from 'lodash';

import TimeHelper from '../../helpers/time';
import BuilderUX from './ux';

export default
@observer
class CourseName extends React.Component {

  static title = 'Choose a name for your course …';
  static propTypes = {
    ux: PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  updateName(ev) {
    this.props.ux.newCourse.name = ev.target.value;
  }

  @action.bound
  updateTimeZone(ev) {
    this.props.ux.newCourse.time_zone = ev.target.value;
  }

  render() {
    const { ux: { onKeyPress, newCourse } } = this.props;
    const zones = TimeHelper.getTimezones();

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
              value={newCourse.time_zone}
              onChange={this.updateTimeZone}
            >
              {map(zones, (tz, key) =>
                <option key={key} value={tz}>{tz}</option>)}
            </Form.Control>
          </InputGroup>
        </Form.Group>
      </Form>
    );
  }
}
