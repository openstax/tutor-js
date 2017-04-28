import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { observer } from 'mobx-react';

import { get, partial, isEqual, isEmpty } from 'lodash';

import { NewCourseActions, NewCourseStore } from '../../flux/new-course';
import { CourseListingStore } from '../../flux/course-listing';
import TutorRouter from '../../helpers/router';

import Choice from './choice';

const KEY = 'new_or_copy';

@observer
export default class NewOrCopy extends React.PureComponent {

  static title = 'Do you want to create a new course or copy a previous course?';
  static shouldSkip() {
    return get(TutorRouter.currentParams(), 'sourceId') ||
           isEmpty(CourseListingStore.teachingCoursesForOffering(NewCourseStore.get('offering_id')));
  }

  onSelect(value) {
    NewCourseActions.set({ [KEY]: value });
  }

  render() {
    return (
      <ListGroup>
        <Choice
          key="course-new"
          active={isEqual(NewCourseStore.get(KEY), 'new')}
          onClick={partial(this.onSelect, 'new')}
          data-new-or-copy="new">
          Create a new course
        </Choice>
        <Choice
          key="course-copy"
          active={isEqual(NewCourseStore.get(KEY), 'copy')}
          onClick={partial(this.onSelect, 'copy')}
          data-new-or-copy="copy">
          Copy a past course
        </Choice>
      </ListGroup>
    );
  }
}
