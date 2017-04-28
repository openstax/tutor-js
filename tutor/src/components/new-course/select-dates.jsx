import React from 'react';
import { observer } from 'mobx-react';
import { map, partial, isEqual } from 'lodash';
import { ListGroup } from 'react-bootstrap';

import { NewCourseActions, NewCourseStore } from '../../flux/new-course';
import { OfferingsStore } from '../../flux/offerings';
import Choice from './choice';

const KEY = 'term';

@observer
export default class SelectDates extends React.PureComponent {
  static title = 'When will you teach this course?';

  onSelect(term) {
    NewCourseActions.set({ [KEY]: term });
  }

  componentWillMount() {
    if (NewCourseStore.get(KEY) != null) { return; }
    const offering = OfferingsStore.get(NewCourseStore.get('offering_id'));
    if ((offering.active_term_years != null) && (offering.active_term_years[1] != null)) {
      this.onSelect(offering.active_term_years[1]);
    }
  }

  render() {
    const offering = OfferingsStore.get(NewCourseStore.get('offering_id'));

    return (
      <ListGroup>
        {map(offering.active_term_years, (term, index) =>
          <Choice
            key={index}
            active={isEqual(NewCourseStore.get(KEY), term)}
            onClick={partial(this.onSelect, term)}>
            <span className="term">
              {term.term}
            </span>
            <span className="year">
              {term.year}
            </span>
          </Choice>)}
      </ListGroup>
    );
  }
}
