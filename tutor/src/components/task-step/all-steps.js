import React from 'react';
import createReactClass from 'create-react-class';
import classnames from 'classnames';

import { TaskStepStore } from '../../flux/task-step';
import { TaskStore } from '../../flux/task';
import { TaskPanelStore } from '../../flux/task-panel';
import { StepContent, ReadingStepContent } from './step-with-reading-content';
import Exercise from './exercise';
import Placeholder from './placeholder';
import { Markdown } from 'shared';

import StepMixin from './step-mixin';
import StepFooterMixin from './step-footer-mixin';
import Router from '../../helpers/router';

import { StepCard } from '../../helpers/policies';

const Reading = createReactClass({
  displayName: 'Reading',
  mixins: [StepMixin],
  isContinueEnabled() { return true; },

  onContinue(cb) {
    return this.props.onStepCompleted().then(this.props.onNextStep);
  },

  renderBody() {
    const { id, taskId } = this.props;
    const { courseId } = Router.currentParams();

    return (
      <ReadingStepContent
        nextStepTitle={TaskPanelStore.getNextStepTitle(taskId, id)}
        onContinue={this.onContinue}
        id={id}
        stepType="reading"
        courseId={courseId} />
    );
  },
});

const Interactive = createReactClass({
  displayName: 'Interactive',
  mixins: [StepMixin],
  isContinueEnabled() { return true; },

  onContinue() {
    return this.props.onStepCompleted().then(this.props.onNextStep);
  },

  renderBody() {
    const { id } = this.props;
    const { courseId } = Router.currentParams();

    return (
      <ReadingStepContent
        id={id}
        onContinue={this.onContinue}
        stepType="interactive"
        courseId={courseId} />
    );
  },
});

const Video = createReactClass({
  displayName: 'Video',
  mixins: [StepMixin],
  isContinueEnabled() { return true; },

  onContinue() {
    return this.props.onStepCompleted().then(this.props.onNextStep);
  },

  renderBody() {
    const { id } = this.props;
    const { courseId } = Router.currentParams();

    return <ReadingStepContent id={id} onContinue={this.onContinue} stepType="video" courseId={courseId} />;
  },
});

const ExternalUrl = createReactClass({
  displayName: 'ExternalUrl',
  mixins: [StepMixin, StepFooterMixin],
  hideContinueButton() { return true; },

  onContinue() {
    const { id, taskId, onStepCompleted } = this.props;
    if (StepCard.canContinue(id) && !TaskStore.isDeleted(taskId)) { return onStepCompleted(); }
  },

  getUrl() {
    const { id } = this.props;
    let { external_url } = TaskStepStore.get(id);
    if (!/^https?:\/\//.test(external_url)) {
      external_url = `http://${external_url}`;
    }

    return external_url;
  },

  // Disable right-click context menu on link.
  // If someone selects "open in new tab" from the menu,
  // we are unable to mark the step as completed
  onContextMenu(ev) {
    return ev.preventDefault();
  },

  renderBody() {
    let descriptionHTML;
    const { taskId } = this.props;
    const { description, title } = TaskStore.get(taskId);
    const external_url = this.getUrl();

    if ((description != null) && (description.length > 0)) { descriptionHTML = <Markdown text={description} />; }

    return (
      <div className="external-step">
        <h1>
          <a
            href={external_url}
            target="_blank"
            onContextMenu={this.onContextMenu}
            onClick={this.onContinue}>
            {title}
          </a>
        </h1>
        {descriptionHTML}
      </div>
    );
  },
});

export { Reading, Interactive, Video, Exercise, Placeholder, ExternalUrl };
