import { React, observer, action, mobxPropTypes } from '../../helpers/react';
import { partial } from 'lodash';
import { Listing, Choice } from '../../components/choices-listing';

@observer
export default class SelectCourse extends React.PureComponent {

  static title = 'Which course are you teaching?';
  static propTypes = {
    ux: mobxPropTypes.observableObject.isRequired,
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
