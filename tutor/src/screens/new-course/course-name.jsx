import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import { map } from 'lodash';

import BuilderUX from '../../models/course/builder-ux';
import TimeHelper from '../../helpers/time';

@observer
export default class CourseName extends React.PureComponent {

  static title = 'Choose a name for your course …';
  static propTypes = {
    ux: React.PropTypes.instanceOf(BuilderUX).isRequired,
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
}
