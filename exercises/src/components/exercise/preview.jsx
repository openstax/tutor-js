import React from 'react';
import { find } from 'lodash';
import { ExercisePreview } from 'shared';
import { Link } from 'react-router-dom';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { CornerRibbon } from 'shared';
import CurrentUser from '../../models/user';

@observer
export default class ExerciseEditingPreview extends React.Component {

  static propTypes = {
    exercise: React.PropTypes.object.isRequired,
    displayEditLink: React.PropTypes.bool,
    showEdit: React.PropTypes.bool,
  };


  @computed get isAuthor() {
    return !!find(this.props.exercise.authors, { user_id: CurrentUser.id });
  }

  render() {
    const { showEdit, exercise, ...previewProps } = this.props;

    return (
      <CornerRibbon
        shadow
        color="red"
        position="topRight"
        label={
          [<div key="ro">READ ONLY</div>,<div key="n">Author: {exercise.authors.names().join(',')}</div>]
        }
        hidden={this.isAuthor}
      >
        <ExercisePreview
          className='exercise-editing-preview'
          isInteractive
          displayAllTags
          displayFeedback
          displayFormats
          exercise={exercise}
          {...previewProps}
        >
          {showEdit && this.isAuthor && <Link className="btn" to={`/exercise/${exercise.uid}`}>EDIT</Link>}
        </ExercisePreview>
      </CornerRibbon>
    );
  }

}
