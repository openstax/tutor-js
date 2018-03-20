import React from 'react';
import Exercise from '../../models/exercises/exercise';
import Attachment from './attachments/attachment';
import AttachmentChooser from './attachments/chooser';

function Attachments({ exercise }) {

  return (
    <div className="attachments">
      {exercise.attachments.map((attachment) =>
        <Attachment
          key={attachment.asset.url}
          exercise={exercise}
          attachment={attachment}
        />
      )}
      <AttachmentChooser exercise={exercise} />
    </div>
  );
}

Attachments.propTypes = {
  exercise: React.PropTypes.instanceOf(Exercise).isRequired,
};

export default Attachments;
