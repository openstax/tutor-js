import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { partial } from 'lodash';

import BuilderUX from '../../models/course/builder-ux';
import Choice from './choice';

@observer
export default class SelectCourse extends React.PureComponent {

  static title = 'Which course are you teaching?';
  static propTypes = {
    ux: React.PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  onSelect(offering) {
    this.props.ux.newCourse.offering = offering;
  }

  render() {
    const { ux, ux: { validOfferings } } = this.props;

    return (
      <ListGroup>
        {validOfferings.map(offering =>
          <Choice
            key={`course-choice-offering-${offering.id}`}
            data-appearance={offering.appearance_code}
            active={(ux.offering === offering)}
            onClick={partial(this.onSelect, offering)}
          >
            {offering.title}
          </Choice>
         )}
      </ListGroup>
    );
  }
}
