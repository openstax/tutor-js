import React from 'react';
import { observer } from 'mobx-react';
import { get } from 'lodash';

import { ListGroup } from 'react-bootstrap';

import { map, isEmpty, isEqual, partial } from 'lodash';

import { NewCourseActions, NewCourseStore } from '../../flux/new-course';
import { CourseListingStore } from '../../flux/course-listing';
import TutorRouter from '../../helpers/router';
import Choice from './choice';

const KEY = 'cloned_from_id';

@observer
export default class CourseClone extends React.PureComponent {

  static title = 'Which course do you want to copy?';

  static shouldSkip() {
    return (
      isEmpty(NewCourseStore.get('new_or_copy')) ||
      (NewCourseStore.get('new_or_copy') === 'new') ||
      get(TutorRouter.currentParams(), 'sourceId')
    );
  }


  constructor(props) {
    super(props);
    this.state = {
      courses: CourseListingStore.teachingCoursesForOffering(NewCourseStore.get('offering_id')),
    };
  }

  componentWillMount() {
    const { courses } = this.state;
    if (courses.length === 1) { this.onSelect(courses[0]); }
  }

  onSelect(course) {
    NewCourseActions.set({ [KEY]: course.id });
    NewCourseActions.set({ name: course.name });
    NewCourseActions.set({ num_sections: course.periods.length });
  }

  render() {
    const { courses } = this.state;

    return (
      <ListGroup>
        {map(courses, course =>
          <Choice
            key={`course-clone-${course.id}`}
            active={isEqual(NewCourseStore.get(KEY), course.id)}
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
