import BS from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import classnames from 'classnames';

import Markdown from '../markdown';
import { CardBody } from '../pinned-header-footer-card/sections';
import { TITLES, ALIASES, INTRO_ALIASES, getIntroText } from '../../helpers/step-helps';

const GROUP_BY_INTRO_ALIAS = _.invert(INTRO_ALIASES);

const PROJECT_NAME = {
  tutor: 'OpenStax Tutor',
  'concept-coach': 'OpenStax Concept Coach',
};

class ExerciseIntro extends React.Component {
  static displayName = 'ExerciseIntro';

  static propTypes = {
    onContinue: PropTypes.func.isRequired,
    project: PropTypes.string.isRequired,
    stepIntroType: PropTypes.string.isRequired,
  };

  componentDidMount() {
    return ReactDOM.findDOMNode(this.refs.body).focus();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // focus the cardbody when paging through
    // Otherwise the continue button may still be focused, causing screenreaders to fail
    if (nextProps.stepIntroType !== this.props.stepIntroType) {
      return ReactDOM.findDOMNode(this.refs.body).focus();
    }
  }

  render() {
    const { stepIntroType, project, onContinue } = this.props;

    const stepGroup = GROUP_BY_INTRO_ALIAS[stepIntroType];

    const classes = classnames('task-step', `openstax-${ALIASES[stepGroup]}-intro`, project);

    return (
      <CardBody ref="body" className={classes}>
        <h1>
          <span>
            {TITLES[stepGroup]}
          </span>
        </h1>
        {getIntroText[stepGroup](project)}
        <button className="btn continue" onClick={onContinue}>
          Continue
        </button>
      </CardBody>
    );
  }
}

export default ExerciseIntro;
