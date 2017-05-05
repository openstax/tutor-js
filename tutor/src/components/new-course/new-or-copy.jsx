import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { partial } from 'lodash';

import Choice from './choice';
import BuilderUX from '../../models/course/builder-ux';

@observer
export default class NewOrCopy extends React.PureComponent {

  static title = 'Do you want to create a new course or copy a previous course?';

  static propTypes = {
    ux: React.PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  onSelect(value) {
    this.props.ux.newCourse.new_or_copy = value;
  }

  render() {
    return (
      <ListGroup>
        <Choice
          key="course-new"
          active={this.props.ux.newCourse.new_or_copy === 'new'}
          onClick={partial(this.onSelect, 'new')}
          data-new-or-copy="new"
        >
          Create a new course
        </Choice>
        <Choice
          key="course-copy"
          active={this.props.ux.newCourse.new_or_copy === 'copy'}
          onClick={partial(this.onSelect, 'copy')}
          data-new-or-copy="copy"
        >
          Copy a past course
        </Choice>
      </ListGroup>
    );
  }
}
