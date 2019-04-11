import PropTypes from 'prop-types';
import React from 'react';
import Interactive from './interactive-icon';
import MultiPart from './multipart-icon';
import classnames from 'classnames';

export default
function ExerciseBadges({ multiPart, interactive, video, className }) {

  const classes = classnames('openstax-exercise-badges', className);
  const badges = [];
  if (multiPart) {
    badges.push(<span key="mpq" className="mpq">
      <MultiPart />
      <span>
        Multi-part question
      </span>
    </span>
    );
  }

  if (interactive) {
    badges.push(<span key="interactive" className="interactive">
      <Interactive />
      <span>
        Interactive
      </span>
    </span>
    );
  }

  if (video) {
    badges.push(<span key="video" className="video">
      <Interactive />
      <span>
        Video
      </span>
    </span>
    );
  }

  if (badges.length) {
    return (
      <div className={classes}>{badges}</div>
    );
  }
  return null;
}

ExerciseBadges.propTypes = {
  multiPart:    PropTypes.bool,
  interactive: PropTypes.bool,
  video:       PropTypes.bool,
  className:      PropTypes.string,
};

ExerciseBadges.defaultProps = {
  multipart: false,
  interactive: false,
  video: false,
};
