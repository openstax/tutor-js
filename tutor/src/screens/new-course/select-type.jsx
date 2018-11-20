import React from 'react';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { partial, map } from 'lodash';
import { action } from 'mobx';

import CCLogo from 'shared/components/logos/concept-coach-horizontal';
import TutorLogo from 'shared/components/logos/tutor-horizontal';

import BuilderUX from '../../models/course/builder-ux';
import { Listing, Choice } from '../choices-listing';

export default
@observer
class SelectType extends React.Component {

  static title = 'Which tool do you want to use?';
  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
  }

  @action.bound
  onSelectType(type) {
    this.props.ux.course_type = type;
  }

  render() {
    const types = {
      tutor: TutorLogo,
      coach: CCLogo,
    };

    return (
      <Listing>
        {map(types, (Logo, type) =>
          <Choice
            key={type}
            data-brand={type}
            active={this.props.ux.course_type === type}
            onClick={partial(this.onSelectType, type)}
          >
            <Logo />
          </Choice>
        )}
      </Listing>
    );
  }
};
