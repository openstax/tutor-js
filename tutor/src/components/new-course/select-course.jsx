import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { observer } from 'mobx-react';

import { first, partial, isEqual, isEmpty, map } from 'lodash';

import { NewCourseActions, NewCourseStore } from '../../flux/new-course';
import TutorRouter from '../../helpers/router';

import { OfferingsStore } from '../../flux/offerings';

import CourseInformation from '../../flux/course-information';

import Choice from './choice';

const KEY = 'offering_id';

const COURSE_TYPE_NAMES = {
  cc: 'Concept Coach',
  tutor: 'Tutor',
};

@observer
export default class SelectCourse extends React.PureComponent {

  static title = 'Which course are you teaching?';
  static shouldSkip() {
    return (
      Boolean(
        TutorRouter.currentParams().sourceId &&
        NewCourseStore.get('offering_id') &&
        OfferingsStore.get(NewCourseStore.get('offering_id'))
      )
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      offerings: OfferingsStore.filter({
        is_concept_coach: NewCourseStore.get('course_type') === 'cc',
      }),
    };
  }

  onSelect(id) {
    NewCourseActions.set({ [KEY]: id });
  }

  componentWillMount() {
    const { offerings } = this.state;
    if ((NewCourseStore.get(KEY) != null) || (offerings.length > 1) || isEmpty(offerings)) { return; }
    this.onSelect(first(offerings).id);
  }

  render() {
    const { offerings } = this.state;
    return (
      <ListGroup>
        {map(offerings, offering => {
          const { appearance_code } = OfferingsStore.get(offering.id);
          return (
            <Choice
              key={`course-choice-offering-${offering.id}`}
              data-appearance={appearance_code}
              active={isEqual(NewCourseStore.get(KEY), offering.id)}
              onClick={partial(this.onSelect, offering.id)}
            >
              {CourseInformation.forAppearanceCode(appearance_code).title}
            </Choice>
          );
        })}
      </ListGroup>
    );
  }
}
