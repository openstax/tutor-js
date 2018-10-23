import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import classnames from 'classnames';
import ExercisePart from './part';
import { ExFooter } from './controls';
import { CardBody } from '../pinned-header-footer-card/sections';
import ExerciseGroup from './group';
import ExerciseBadges from '../exercise-badges';
import ExerciseIdentifierLink from '../exercise-identifier-link';
import ScrollToMixin from '../scroll-to-mixin';

const ExerciseMixin = {
  propTypes: {
    parts: PropTypes.array.isRequired,
    canOnlyContinue: PropTypes.func,
    currentStep: PropTypes.number,
  },

  isSinglePart() {
    const { parts } = this.props;
    return parts.length === 1;
  },

  canAllContinue() {
    const { parts, canOnlyContinue } = this.props;

    return _.every(parts, part => canOnlyContinue(part.id));
  },

  shouldControl(id) {
    return !this.props.canOnlyContinue(id);
  },

  renderPart(part, partProps) {
    const props = _.omit(this.props, 'parts', 'canOnlyContinue', 'footer', 'goToStep', 'controlButtons');

    return (
      <ExercisePart
        focus={this.isSinglePart()}
        {...props}
        {...partProps}
        step={part}
        id={part.id}
        taskId={part.task_id} />
    );
  },

  renderSinglePart() {
    const { parts, footer, controlButtons } = this.props;

    const part = _.first(parts);

    const partProps = {
      idLink: this.renderIdLink(),
      focus: true,
      includeGroup: true,
      footer,
      controlButtons,
    };

    return this.renderPart(part, partProps);
  },

  renderMultiParts() {
    const { parts, currentStep } = this.props;

    return _.map(parts, (part, index) => {
      // disable keyStep if this is not the current step
      let keySet;
      if (part.stepIndex !== currentStep) { keySet = null; }
      const partProps = {
        pinned: false,
        focus: part.stepIndex === currentStep,
        includeGroup: false,
        includeFooter: this.shouldControl(part.id),
        keySet,
        stepPartIndex: part.stepIndex,
        key: `exercise-part-${index}`,
      };

      // stim and stem are the same for different steps currently.
      // they should only show up once.
      if (index !== 0) {
        part.content = _.omit(part.content, 'stimulus_html', 'stem_html');
      }

      return this.renderPart(part, partProps);
    });
  },

  renderGroup() {
    const { parts } = this.props;
    const step = _.last(parts);

    return (
      <ExerciseGroup
        key="step-exercise-group"
        project={this.props.project}
        group={step.group}
        related_content={step.related_content} />
    );
  },

  renderFooter() {
    let canContinueControlProps;
    const { parts, onNextStep, currentStep, pinned } = this.props;
    const step = _.last(parts);

    if (this.canAllContinue()) {
      canContinueControlProps = {
        isContinueEnabled: true,
        onContinue: _.partial(onNextStep, { currentStep: step.stepIndex }),
      };
    }

    const footerProps = _.omit(this.props, 'onContinue');
    if (!pinned) { footerProps.idLink = this.renderIdLink(false); }
    return <ExFooter {...canContinueControlProps} {...footerProps} panel="review" />;
  },

  renderIdLink(related = true) {
    let related_content;
    const { parts } = this.props;
    const step = _.last(parts);

    // TODO check whether or not if related is still needed
    if (related) { ((((((({ related_content } = step))))))); }

    if (step.content != null ? step.content.uid : undefined) {
      return (
        <ExerciseIdentifierLink
          key="exercise-uid"
          exerciseId={step.content != null ? step.content.uid : undefined}
          related_content={related_content} />
      );
    }
  },
};


const ExerciseWithScroll = createReactClass({
  displayName: 'ExerciseWithScroll',
  mixins: [ExerciseMixin, ScrollToMixin],

  componentDidMount() {
    const { currentStep } = this.props;
    if (currentStep != null) { return this.scrollToStep(currentStep); }
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.currentStep !== this.props.currentStep) { return this.scrollToStep(nextProps.currentStep); }
  },

  scrollToStep(currentStep) {
    const stepSelector = `[data-step='${currentStep}']`;
    return this.scrollToSelector(stepSelector, { updateHistory: false, unlessInView: true });
  },

  render() {
    let { parts, footer, pinned } = this.props;
    const classes = classnames(
      'openstax-multipart-exercise-card',
      {
        'deleted-homework': ((this.props.task != null ? this.props.task.type : undefined) === 'homework') && (this.props.task != null ? this.props.task.is_deleted : undefined),
      },
    );

    if (this.isSinglePart()) {
      return this.renderSinglePart();
    } else {
      if (pinned) { if (footer == null) { footer = this.renderFooter(); } }
      return (
        <CardBody footer={footer} pinned={pinned} className={classes}>
          <ExerciseBadges isMultipart={true} />
          {this.renderGroup()}
          {this.renderMultiParts()}
          {pinned ? this.renderIdLink(false) : undefined}
        </CardBody>
      );
    }
  },
});


const Exercise = createReactClass({
  displayName: 'Exercise',
  mixins: [ExerciseMixin],

  render() {
    const { footer, pinned } = this.props;
    const classes = classnames(
      'openstax-multipart-exercise-card',
      {
        'deleted-homework': ((this.props.task != null ? this.props.task.type : undefined) === 'homework') && (this.props.task != null ? this.props.task.is_deleted : undefined),
      },
    );

    if (this.isSinglePart()) {
      return (
        <CardBody footer={footer} className={classes}>
          {this.renderSinglePart()}
        </CardBody>
      );
    } else {
      return (
        <CardBody
          pinned={pinned}
          footer={footer || this.renderFooter()}
          className={classes}>
          <ExerciseBadges isMultipart={true} />
          {this.renderGroup()}
          {this.renderMultiParts()}
          {pinned ? this.renderIdLink(false) : undefined}
        </CardBody>
      );
    }
  },
});

export { Exercise, ExerciseWithScroll };
