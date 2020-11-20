import PropTypes from 'prop-types';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import React from 'react';
import Icon from '../icon';
import { map, compact } from 'lodash';
import Interactive from './interactive-icon';
import MultiPart from './multipart-icon';
import classnames from 'classnames';


const BADGES = {
  multiPart: {
    el: (
      <span key="mpq" className="mpq">
        <MultiPart />
        <span>
          Multi-part question
        </span>
      </span>
    ),
  },
  interactive: {
    el: (
      <span key="interactive" className="interactive">
        <Interactive />
        <span>
          Interactive
        </span>
      </span>
    ),
  },
  video: {
    el: (
      <span key="video" className="video">
        <Interactive />
        <span>
          Video
        </span>
      </span>
    ),
  },
  personalized: {
    el: (
      <span key="personalized" className="personalized">
        <i className="icon icon-sm icon-personalized" />
        <span>
          Personalized
        </span>
        <Icon type="info-circle" />
      </span>
    ),
    tooltip: 'Personalized questions are choosen specifically for you by Tutor based on your learning history',
  },
  spacedPractice: {
    el: (
      <span key="spacedPractice" className="spaced-practice">
        <i className="icon icon-sm icon-spaced-practice" />
        <span>
          Spaced Practice
        </span>
        <Icon type="info-circle" />
      </span>
    ),
    tooltip: (
      <div>
        <h6>What is spaced practice?</h6>
        <p>
          Did you know?  Research shows you can strengthen your
          memory—<b>and spend less time studying</b>—if
          you revisit material over multiple study sessions.
        </p>
        <p>
          Tutor will include <b>spaced practice</b> questions from prior
          assignments to give your learning a boost. You may occasionally
          see questions you’ve seen before.
        </p>
      </div>
    ),
  },
  writtenResponse: {
    el: (
      <span key="wrm" className="wrm">
        <i className="icon icon-md icon-wrm" />
        <span>
          Written-response
        </span>
        <Icon type="info-circle" />
      </span>
    ),
    tooltip: (
      <div>
        <p>
          This is an open-ended question. Feedback will be available once the response is graded.
        </p>
      </div>
    ),
  },
};


const Badge = ({ el, tooltip }) => {
  if (!tooltip) { return el; }
  return (
    <OverlayTrigger overlay={<Tooltip>{tooltip}</Tooltip>}>
      {el}
    </OverlayTrigger>
  );
};
Badge.propTypes = {
  el: PropTypes.node.isRequired,
  tooltip: PropTypes.node,
};
export default
function ExerciseBadges({ className, ...badgeProps }) {
  const badges = compact(map(badgeProps, (wants, type) => wants && BADGES[type]));

  if (!badges.length || badgeProps.questionType === 'student-mpp') { return null; }

  return (
    <div className={classnames('openstax-exercise-badges', className)} >
      {badges.map((badge, index) => <Badge key={index} {...badge} />)}
    </div>
  );

}

ExerciseBadges.propTypes = {
  className:      PropTypes.string,
  spacedPractice: PropTypes.bool,
  personalized:   PropTypes.bool,
  interactive:    PropTypes.bool,
  multiPart:      PropTypes.bool,
  video:          PropTypes.bool,
  questionType:   PropTypes.string,
};
