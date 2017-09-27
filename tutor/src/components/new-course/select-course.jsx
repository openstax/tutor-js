import React from 'react';

import { Listing, Choice } from '../choices-listing';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { action } from 'mobx';
import { partial } from 'lodash';

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
      <Listing>
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
      </Listing>
    );
  }
}
