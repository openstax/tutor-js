import React from 'react';
import { ExercisePreview } from 'shared';
import {
  Row, Col, FormGroup, InputGroup, Dropdown, Button,
  FormControl, DropdownButton, MenuItem,
} from 'react-bootstrap';
import { observer } from 'mobx-react';

@observer
export default class Preview extends React.Component {

  static propTypes = {
    exercise: React.PropTypes.object.isRequired,
  };

  render() {
    const { exercise } = this.props;

    return (
      <ExercisePreview
        className='exercise-card'
        isInteractive={false}
        isVerticallyTruncated={true}
        exercise={exercise}
      >
        <a href="/foo">EDIT {exercise.uid}</a>
      </ExercisePreview>
    );
  }

}
