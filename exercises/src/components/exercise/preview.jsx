import React from 'react';
import { ExercisePreview } from 'shared';
import { observer } from 'mobx-react';

@observer
export default class ExerciseEditingPreview extends React.Component {

  static propTypes = {
    exercise: React.PropTypes.object.isRequired,
  };

  render() {

    return (
      <ExercisePreview
        className='exercise-editing-preview'
        isInteractive
        displayAllTags
        displayFeedback
        displayFormats
        {...this.props}
      />
    );
  }

}
