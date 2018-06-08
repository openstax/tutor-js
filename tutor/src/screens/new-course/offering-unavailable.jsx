import { React, mobxPropTypes, observer, computed } from '../../helpers/react';
import { Listing, Choice } from '../../components/choices-listing';
import SupportEmailLink from '../../components/support-email-link';
import CourseBuilderUX from '../../models/course/builder-ux';

@observer
export default class OfferingUnavailable extends React.Component {

  static title = 'This course is no longer available';

  render() {
    return (
      <div>
        <p>
          This course cannot be copied because it is no longer available.
        </p>
        <p>
          Please contact <SupportEmailLink displayEmail /> for more information.
        </p>
        <Listing>
          <Choice
            key={`course-choice-offering-${choice.id}`}
            data-appearance={choice.appearance_code}
            active={this.bio2eOffering === ux.offering}
            onClick={this.onSelect}
          >
            {choice.title}
          </Choice>
        </Listing>


      </div>
    );
  }
}
