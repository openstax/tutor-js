import React from 'react';
import { observer } from 'mobx-react';
import { partial } from 'lodash';

import { action } from 'mobx';
import { ListGroup } from 'react-bootstrap';

import Choice from './choice';
import BuilderUX from '../../models/course/builder-ux';

@observer
export default class CourseClone extends React.PureComponent {

  static title = 'Which course do you want to copy?';

  static propTypes = {
    ux: React.PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  onSelect(course) {
    this.props.ux.newCourse.cloned_from = course;
  }

  render() {
    const { ux } = this.props;

    return (
      <ListGroup>
        {ux.cloneSources.map(course =>
          <Choice
            key={`course-clone-${course.id}`}
            active={course === ux.newCourse.cloned_from}
            onClick={partial(this.onSelect, course)}>
            <div className="contents">
              <div className="title">
                {course.name}
              </div>
              <div className="sub-title">
                {course.term}
                {' '}
                {course.year}
              </div>
            </div>
          </Choice>
         )}
      </ListGroup>
    );
  }
}
