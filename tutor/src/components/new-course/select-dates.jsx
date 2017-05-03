import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { partial } from 'lodash';

import { ListGroup } from 'react-bootstrap';

import Choice from './choice';
import BuilderUX from '../../models/course/builder-ux';

@observer
export default class SelectDates extends React.PureComponent {
  static title = 'When will you teach this course?';

  static propTypes = {
    ux: React.PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  onSelect(term) {
    this.props.ux.newCourse.term = term;
  }

  render() {
    const { ux, ux: { offering } } = this.props;

    return (
      <ListGroup>
        {offering.validTerms.map((term, index) =>
          <Choice
            key={index}
            active={ux.newCourse.term === term}
            onClick={partial(this.onSelect, term)}
          >
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
