import React from 'react';
import { observer } from 'mobx-react';
import { ListGroup } from 'react-bootstrap';
import { partial, isEqual, map } from 'lodash';

import TutorRouter from '../../helpers/router';

import CCLogo from 'shared/src/components/logos/concept-coach-horizontal';
import TutorLogo from 'shared/src/components/logos/tutor-horizontal';

import { NewCourseActions, NewCourseStore } from '../../flux/new-course';

import Choice from './choice';

const KEY = 'course_type';

@observer
export default class SelectType extends React.PureComponent {

  static title = 'Which tool do you want to use?';
  static shouldSkip() {
    return TutorRouter.currentParams().sourceId;
  }

  onSelectType(type) {
    NewCourseActions.set({ [KEY]: type });
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
            active={isEqual(NewCourseStore.get(KEY), type)}
            onClick={partial(this.onSelectType, type)}>
            <Logo />
          </Choice>
         )}
      </ListGroup>
    );
  }
}
