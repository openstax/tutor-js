import PropTypes from 'prop-types';
import React from 'react';
import { keys } from 'lodash';
import { Popover, OverlayTrigger } from 'react-bootstrap';

import {
  INDIVIDUAL_REVIEW, SPACED_PRACTICE_GROUP,
  PERSONALIZED_GROUP as SH_PERSONALIZED_GROUP,
  ALIASES, LABELS, getHelpText,
} from '../../helpers/step-helps';

const DEFAULT_GROUP =
  { show: false };
const REVIEW_GROUP = {
  show: true,
  label: LABELS[SPACED_PRACTICE_GROUP],
};

const PERSONALIZED_GROUP = {
  show: true,
  label: LABELS[SH_PERSONALIZED_GROUP],
};

const RULES = {
  default: DEFAULT_GROUP,
  core: DEFAULT_GROUP,
  recovery: DEFAULT_GROUP,
  personalized: PERSONALIZED_GROUP,
  individual: INDIVIDUAL_REVIEW,
  'spaced practice': REVIEW_GROUP,
};

class ExerciseGroup extends React.Component {
  static defaultProps = {
    group: 'default',
    related_content: [],
  };

  static displayName = 'ExerciseGroup';

  static propTypes = {
    group: PropTypes.oneOf(keys(RULES)).isRequired,
    project: PropTypes.oneOf(['tutor', 'concept-coach']).isRequired,
  };

  getGroupLabel = (group, related_content) => {
    let labels;
    if (RULES[group].label != null) {
      labels = RULES[group].label;
    }

    return labels;
  };

  getPossibleGroups = () => {
    return keys(RULES);
  };

  render() {
    const { group, related_content, exercise_uid, project } = this.props;
    let groupDOM = [];
    if (RULES[group] == null) { return null; }

    if (RULES[group].show) {
      const className = ALIASES[group] || group;
      const labels = this.getGroupLabel(group, related_content);
      const isSpacedPractice = group === SPACED_PRACTICE_GROUP;

      groupDOM = [
        <i className={`icon-sm icon-${className}`} key="group-icon" />,
        <span className="openstax-step-group-label" key="group-label">
          {labels}
        </span>,
      ];
    }

    if (RULES[group].show) {
      const popover = <Popover id="instructions" ref="popover" className="openstax instructions">
        {getHelpText[group](project)}
      </Popover>;
      groupDOM.push(
        <OverlayTrigger key="info" placement="bottom" overlay={popover}>
          <i className="fa fa-info-circle" />
        </OverlayTrigger>
      );
    }
    return (
      <div className="openstax-step-group">
        {groupDOM}
      </div>
    );
  }
}

export default ExerciseGroup;
