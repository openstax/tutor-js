import { React, action, observer } from '../../helpers/react';
import { partial } from 'lodash';
import { Listing, Choice } from '../../components/choices-listing';
import BuilderUX from './ux';

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
      <Listing>
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
      </Listing>
    );
  }
}
