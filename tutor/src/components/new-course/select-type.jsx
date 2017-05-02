import React from 'react';
import { observer } from 'mobx-react';
import { ListGroup } from 'react-bootstrap';
import { partial, map } from 'lodash';
import { action } from 'mobx';

import CCLogo from 'shared/src/components/logos/concept-coach-horizontal';
import TutorLogo from 'shared/src/components/logos/tutor-horizontal';

import BuilderUX from '../../models/course/builder-ux';
import Choice from './choice';

@observer
export default class SelectType extends React.PureComponent {

  static title = 'Which tool do you want to use?';
  static propTypes = {
    ux: React.PropTypes.instanceOf(BuilderUX).isRequired,
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
      <ListGroup>
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
      </ListGroup>
    );
  }
}
