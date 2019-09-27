import PropTypes from 'prop-types';
import { React, action, observer } from 'vendor';
import { partial } from 'lodash';
import { Listing, Choice } from '../../components/choices-listing';
import BuilderUX from './ux';

export default
@observer
class CourseClone extends React.Component {

  static title = 'Which course do you want to copy?';

  static propTypes = {
    ux: PropTypes.instanceOf(BuilderUX).isRequired,
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
