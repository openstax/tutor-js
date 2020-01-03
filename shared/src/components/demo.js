/* eslint-disable */
import React from 'react';
import createReactClass from 'create-react-class';
import { Container, Row, Col, Button } from 'react-bootstrap';
import forEach from 'lodash/forEach';
import extend from 'lodash/extend';
import merge from 'lodash/merge';
import map from 'lodash/map';

import EventEmitter2 from 'eventemitter2';
import classnames from 'classnames';

import { Exercise, ExerciseWithScroll } from './exercise';
import Notifications from '../model/notifications';
import URLs from '../model/urls';
import NotificationBar from './notifications/bar';
import SuretyGuard from './surety-guard';
import exerciseStub from '../../api/exercise';
import multipartExerciseStub from '../../api/exercise-multipart';
const exerciseEvents = new EventEmitter2({ wildcard: true });
const STEP_ID = exerciseStub['free-response'].id;
const MULTIPART_STEP_IDS = ld.keys(multipartExerciseStub);
const SINGLEPART_STEP_IDS = [STEP_ID];

const steps = [];
steps[STEP_ID] = {};
forEach(multipartExerciseStub, (step, stepId) => steps[stepId] = {});

const stubForExercise = {};
stubForExercise[STEP_ID] = exerciseStub;

const stubsForExercises = extend({}, multipartExerciseStub, stubForExercise);

const ExercisePreview = require('./exercise-preview');
const exercisePreviewStub = require('../../api/exercise-preview/data');

const Breadcrumb = require('./breadcrumb');
const breadcrumbStub = require('../../api/breadcrumbs/steps');

const ArbitraryHtmlAndMath = require('./html');
const HTMLStub = require('../../api/html/data');

const getCurrentCard = function(stepId) {
  const step = steps[stepId];
  let panel = 'free-response';
  if (step.answer_id) {
    panel = 'review';
  } else if (step.free_response) {
    panel = 'multiple-choice';
  }
  return panel;
};

const getUpdatedStep = function(stepId) {
  const step = steps[stepId];
  const panel = getCurrentCard(stepId);
  return steps[stepId] = merge({}, stubsForExercises[stepId][panel], step);
};

const getProps = function(stepIds) {
  let props;
  const localSteps = {};

  forEach(stepIds, stepId => localSteps[stepId] = getUpdatedStep(stepId));

  const parts = map(stepIds, stepId => localSteps[stepId]);

  return props = {
    parts,

    canOnlyContinue(stepId) {
      return (localSteps[stepId].correct_answer_id != null);
    },

    getCurrentCard,

    setAnswerId(stepId, answerId) {
      return localSteps[stepId].answer_id = answerId;
    },

    setFreeResponseAnswer(stepId, freeResponse) {
      localSteps[stepId].free_response = freeResponse;
      return exerciseEvents.emit('change');
    },

    onContinue() {
      return exerciseEvents.emit('change');
    },

    onStepCompleted() {
      return console.info('onStepCompleted');
    },

    onNextStep() {
      return console.info('onNextStep');
    },
  };
};

class SuretyDemo extends React.Component {
  state = { triggered: false };
  onConfirm = () => { return this.setState({ triggered: true }); };

  render() {
    let message;
    if (this.state.triggered) {
      message = 'you seem to be sure';
    }

    return (
      <div className="surety-demo">
        <h3>
          {message}
        </h3>
        <SuretyGuard
          title={false}
          placement="right"
          message="Destroy ALL THE THINGS?"
          onConfirm={this.onConfirm}>
          <Button>
            Perform Dangerous Operation!
          </Button>
        </SuretyGuard>
      </div>
    );
  }
}

const ExerciseDemo = createReactClass({
  displayName: 'ExerciseDemo',

  getInitialState() {
    return { exerciseProps: getProps(SINGLEPART_STEP_IDS) };
  },

  getDefaultProps() {
    return {
      goToStep() {
        return console.info('goToStep', arguments);
      },
    };
  },

  update() {
    return this.setState({ exerciseProps: getProps(SINGLEPART_STEP_IDS) });
  },

  UNSAFE_componentWillMount() {
    return exerciseEvents.on('change', this.update);
  },

  componentWillUnmount() {
    return exerciseEvents.off('change', this.update);
  },

  render() {
    const { exerciseProps } = this.state;
    return <Exercise {...this.props} {...exerciseProps} project="tutor" pinned={false} />;
  },
});

const MultipartExerciseDemo = createReactClass({
  displayName: 'MultipartExerciseDemo',

  getInitialState() {
    return { exerciseProps: getProps(MULTIPART_STEP_IDS) };
  },

  getDefaultProps() {
    return {
      goToStep() {
        return console.info('goToStep', arguments);
      },
    };
  },

  update() {
    return this.setState({ exerciseProps: getProps(MULTIPART_STEP_IDS) });
  },

  UNSAFE_componentWillMount() {
    return exerciseEvents.on('change', this.update);
  },

  componentWillUnmount() {
    return exerciseEvents.off('change', this.update);
  },

  render() {
    const { exerciseProps, currentStep } = this.state;
    const { goToStep, onPartEnter, onPartLeave } = this.props;

    return (
      <ExerciseWithScroll
        {...exerciseProps}
        project="concept-coach"
        goToStep={goToStep}
        currentStep={currentStep}
        pinned={false} />
    );
  },
});

class ExercisePreviewDemo extends React.Component {
  static displayName = 'ExercisePreviewDemo';

  state = {
    isSelected: false,

    toggles: {
      feedback:    false,
      interactive: false,
      tags:        false,
      formats:     false,
      height:      false,
    },
  };

  onDetailsClick = (ev, exercise) => {
    return console.warn('Exercise details was clicked');
  };

  onSelection = () => {
    return this.setState({ isSelected: !this.state.isSelected });
  };

  onToggle = (ev) => {
    const { toggles } = this.state;
    toggles[ev.target.name] = ev.target.checked;
    return this.setState({ toggles });
  };

  render() {
    return (
      <ExercisePreview
        exercise={exercisePreviewStub}
        onSelection={this.onSelection}
        onDetailsClick={this.onDetailsClick}
        isSelected={this.state.isSelected}
        isInteractive={this.state.toggles.interactive}
        displayFormats={this.state.toggles.formats}
        displayAllTags={this.state.toggles.tags}
        displayFeedback={this.state.toggles.feedback}
        isVerticallyTruncated={this.state.toggles.truncated}>
        <label>
          <input
            type="checkbox"
            onChange={this.onToggle}
            name="interactive"
            checked={this.state.toggles.interactive} />
          {' Interactive\
    '}
        </label>
        <label>
          <input
            type="checkbox"
            onChange={this.onToggle}
            name="feedback"
            checked={this.state.toggles.feedback} />
          {' Preview Feedback\
    '}
        </label>
        <label>
          <input
            type="checkbox"
            onChange={this.onToggle}
            name="tags"
            checked={this.state.toggles.tags} />
          {' Display All Tags\
    '}
        </label>
        <label>
          <input
            type="checkbox"
            onChange={this.onToggle}
            name="formats"
            checked={this.state.toggles.formats} />
          {' Show Formats\
    '}
        </label>
        <label>
          <input
            type="checkbox"
            onChange={this.onToggle}
            name="truncated"
            checked={this.state.toggles.truncated} />
          {' Limit Height\
    '}
        </label>
      </ExercisePreview>
    );
  }
}

class BreadcrumbDemo extends React.Component {
  static displayName = 'BreadcrumbDemo';
  state = { currentStep: 0 };

  goToStep = (stepIndex) => {
    console.info(`goToStep ${stepIndex}`);
    return this.setState({ currentStep: stepIndex });
  };

  render() {
    const { currentStep } = this.state;

    const crumbs = map(breadcrumbStub.steps, function(crumbStep, index) {
      let crumb;
      return crumb = {
        key: index,
        data: crumbStep,
        crumb: true,
        type: 'step',
      };
    });

    crumbs.push({ type: 'end', key: crumbs.length + 1, data: {} });

    const breadcrumbsNoReview = map(crumbs, crumb => {
      return (
        <Breadcrumb
          crumb={crumb}
          key={crumb.key}
          step={crumb.data || {}}
          currentStep={currentStep}
          canReview={false}
          goToStep={this.goToStep} />
      );
    });

    const breadcrumbsReview = map(crumbs, (crumb, key) => {
      if ((crumb.type === 'step') && crumb.data.is_completed) {
        crumb.data.correct_answer_id = '3';
      }

      return (
        <Breadcrumb
          key={key}
          crumb={crumb}
          step={crumb.data || {}}
          currentStep={currentStep}
          canReview={true}
          goToStep={this.goToStep} />
      );
    });

    return (
      <div>
        <div>
          <h3>
            Reading, no review
          </h3>
          <div className="task-breadcrumbs">
            {breadcrumbsNoReview}
          </div>
        </div>
        <div className="task-homework">
          <h3>
            Homework, no review
          </h3>
          <div className="task-breadcrumbs">
            {breadcrumbsNoReview}
          </div>
        </div>
        <div>
          <h3>
            Reading, with review
          </h3>
          <div className="task-breadcrumbs">
            {breadcrumbsReview}
          </div>
        </div>
        <div className="task-homework">
          <h3>
            Homework, with review
          </h3>
          <div className="task-breadcrumbs">
            {breadcrumbsReview}
          </div>
        </div>
      </div>
    );
  }
}

class HTMLDemo extends React.Component {
  static displayName = 'HTMLDemo';

  render() {
    return <ArbitraryHtmlAndMath {...HTMLStub} className="col-xs-6" />;
  }
}

class NoticesDemo extends React.Component {
  state = { running: false };

  showMessage = () => {
    return Notifications.display({
      message: this.refs.message.value,
      level: this.refs.type.value,
    });
  };

  startPoll = () => {
    // These will be loaded from the app's bootsrap data in normal use
    URLs.update({
      accounts_api_url:     'http://localhost:2999/api',
      tutor_api_url:        'http://localhost:3001/api',
      accounts_profile_url: 'http://localhost:2999/profile',
    });
    return Notifications.startPolling();
  };

  render() {
    return (
      <div className="notices">
        <NotificationBar />
        <div className="test-message">
          <span>
            Test Message:
          </span>
          <input type="text" ref="message" />
          <select ref="type">
            <option value="success">
              Success
            </option>
            <option value="notice" selected={true}>
              Notice
            </option>
            <option value="alert">
              Alert
            </option>
            <option value="error">
              Error
            </option>
          </select>
          <button onClick={this.showMessage}>
            Display
          </button>
        </div>
        <button onClick={this.startPoll}>
          Start Polling
        </button>
      </div>
    );
  }
}

class Demo extends React.Component {
  static displayName = 'Demo';

  render() {
    let demos = {
      exercisePreview: <ExercisePreviewDemo />,
      notices: <NoticesDemo />,
      multipartExercise: <MultipartExerciseDemo />,
      exercise: <ExerciseDemo />,
      surety: <SuretyDemo />,
      breadcrumbs: <BreadcrumbDemo />,
      html: <HTMLDemo />,
    };

    demos = map(demos, (demo, name) =>
      <Row key={name} className="demo openstax-wrapper">
        <Col xs={12}>
          <h1>
            {`${name}`}
          </h1>
          <section className={`${name}-demo`}>
            {demo}
          </section>
        </Col>
      </Row>
    );
    return (
      <Container className="demos openstax">
        {demos}
      </Container>
    );
  }
}

export default Demo;
