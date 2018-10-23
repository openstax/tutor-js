import { React, action, observer } from '../../helpers/react';
import PropTypes from 'prop-types';
import { Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
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
    const { ux: { newCourse } } = this.props;
    const zones = TimeHelper.getTimezones();

    return (
      <Form>
        <FormGroup className="course-details-name">
          <FormControl
            autoFocus={true}
            type="text"
            defaultValue={newCourse.name}
            placeholder="Choose a name for your course"
            onChange={this.updateName} />
        </FormGroup>
        <FormGroup className="course-details-sections">
          <InputGroup>
            <InputGroup.Addon>
              Time zone
            </InputGroup.Addon>
            <FormControl
              componentClass="select"
              placeholder="select"
              value={newCourse.time_zone}
              onChange={this.updateTimeZone}
            >
              {map(zones, (tz, key) =>
                <option key={key} value={tz}>{tz}</option>)}
            </FormControl>
          </InputGroup>
        </FormGroup>
      </Form>
    );
  }
};
