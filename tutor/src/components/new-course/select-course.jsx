import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { action } from 'mobx';
import { partial } from 'lodash';

import Choice from './choice';

@observer
export default class SelectCourse extends React.PureComponent {

  static title = 'Which course are you teaching?';
  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
  }

  @action.bound
  onSelect(offering) {
    this.props.ux.newCourse.offering = offering;
  }

  render() {
    const { offering, validOfferings } = this.props.ux;

    return (
      <ListGroup>
        {validOfferings.map(choice =>
          <Choice
            key={`course-choice-offering-${choice.id}`}
            data-appearance={choice.appearance_code}
            active={(choice === offering)}
            onClick={partial(this.onSelect, choice)}
            >
            {choice.title}
          </Choice>
        )}
      </ListGroup>
    );
  }
}
