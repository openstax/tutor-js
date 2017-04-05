import React from 'react';
import classnames from 'classnames';

import { observer } from 'mobx-react';
import TaskStep from '../../models/task/step';

import { TaskStepStore } from '../../flux/task-step';
import { TaskStore } from '../../flux/task';
import { StepContent, ReadingStepContent } from './step-with-reading-content';
import Exercise from './exercise';
import Placeholder from './placeholder';
import { Markdown } from 'shared';

import StepMixin from './step-mixin';
import StepFooterMixin from './step-footer-mixin';
import Router from '../../helpers/router';

import { StepPanel } from '../../helpers/policies';

@observer
export class Reading extends React.PureComponent {

  static propTypes = {
    step: React.PropTypes.instanceOf(TaskStep).isRequired,
  }

    //  mixins: [StepMixin],
    //  isContinueEnabled() { return true; },
    // onContinue() {
  //   this.props.onStepCompleted();
  //   return (
  //       this.props.onNextStep()
  //   );
  // },
  render() {
    const { courseId } = Router.currentParams();
    return (
      <ReadingStepContent
        stepType="reading"
        chapter_section={this.props.step.chapter_section}
        step={this.props.step}
        courseId={courseId}
      />
    );
  }
}

const Interactive = React.createClass({
  displayName: 'Interactive',
  mixins: [StepMixin],
  isContinueEnabled() { return true; },
  onContinue() {
    this.props.onStepCompleted();
    return (
        this.props.onNextStep()
    );
  },
  renderBody() {
    const { id } = this.props;
    const { courseId } = Router.currentParams();

    return (

      <ReadingStepContent id={id} stepType="interactive" courseId={courseId} />

    );
  },
});

const Video = React.createClass({
  displayName: 'Video',
  mixins: [StepMixin],
  isContinueEnabled() { return true; },
  onContinue() {
    this.props.onStepCompleted();
    return (
        this.props.onNextStep()
    );
  },
  renderBody() {
    const { id } = this.props;
    const { courseId } = Router.currentParams();

    return (

      <ReadingStepContent id={id} stepType="video" courseId={courseId} />

    );
  },
});

const ExternalUrl = React.createClass({
  displayName: 'ExternalUrl',
  mixins: [StepMixin, StepFooterMixin],
  hideContinueButton() { return true; },
  onContinue() {
    const { id, taskId, onStepCompleted } = this.props;
    if (StepPanel.canContinue(id) && !TaskStore.isDeleted(taskId)) { return onStepCompleted(); }
  },

  getUrl() {
    const { id } = this.props;
    let { external_url } = TaskStepStore.get(id);
    if (!/^https?:\/\//.test(external_url)) {
      external_url = `http://${external_url}`;
    }

    return (

        external_url

    );
  },

  // Disable right-click context menu on link.
  // If someone selects "open in new tab" from the menu,
  // we are unable to mark the step as completed
  onContextMenu(ev) {
    return (
        ev.preventDefault()
    );
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

export { Interactive, Video, Exercise, Placeholder, ExternalUrl };
