import { React, observer, action, mobxPropTypes } from 'vendor';
import { partial } from 'lodash';
import { Listing, Choice } from '../../components/choices-listing';

@observer
export default
class SelectCourse extends React.Component {

  static title = (ux) => ux.selectOfferingTitle;
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
