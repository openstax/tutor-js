import _ from 'underscore';
import React from 'react';
import camelCase from 'lodash/camelCase';

import classnames from 'classnames';
import TutorLink from '../link';
import { Details } from '../task/details';
import BrowseTheBook from '../buttons/browse-the-book';
import LateIcon from '../late-icon';
import Courses from '../../models/courses-map';
import { ChapterSectionMixin } from 'shared';

import { TaskStore } from '../../flux/task';
import { ViewingAsStudentName } from '../task/viewing-as-student-name';

import { StepPanel } from '../../helpers/policies';

export default {
  mixins: [ ChapterSectionMixin ],

  renderTeacherReadOnlyDetails({ stepId, taskId, courseId, review }) {

    let taskDetails;
    if (!(review != null ? review.length : undefined)) {
      taskDetails = this.renderDefaultDetails({ stepId, taskId, courseId, review });

      taskDetails = [
        <ViewingAsStudentName
          key="viewing-as"
          courseId={courseId}
          taskId={taskId}
          className="task-footer-detail" />,
        taskDetails,
      ];
    }

    return taskDetails;
  },

  renderCoversSections(sections) {
    const course = Courses.get(this.props.courseId);
    sections = _.map(sections, section => {
      const combined = this.sectionFormat(section);
      return (
        <BrowseTheBook unstyled={true} key={combined} course={course} chapterSection={combined}>
          {combined}
        </BrowseTheBook>
      );
    });

    return (
      <div key="task-covers" className="task-covers">
        {'\
    Reading covers: '}
        {sections}
      </div>
    );
  },

  renderDefaultDetails({ stepId, taskId, courseId, review }) {
    if (review != null ? review.length : undefined) { return null; }

    const task = TaskStore.get(taskId);
    const { title, sections } = TaskStore.getDetails(taskId);

    const taskAbout = <div key="about" className="task-footer-detail">
      <div className="task-title">
        {title}
      </div>
      {sections.length ? this.renderCoversSections(sections) : undefined}
    </div>;

    const buildLateMessage = (task, status) => `${status.how_late} late`;

    const lateIcon = <LateIcon key="step-late" task={task} buildLateMessage={buildLateMessage} />;

    const taskDetails = <Details
      lateStatus={lateIcon}
      key="details"
      task={task}
      className="task-footer-detail" />;

    return [
      taskAbout,
      taskDetails,
    ];
  },

  renderTaskDetails({ stepId, taskId, courseId, review }) {
    const panel = StepPanel.getPanel(stepId);
    const renderDetailsForPanelMethod = camelCase(`render-${panel}-details`);

    return (typeof this[renderDetailsForPanelMethod] === 'function' ? this[renderDetailsForPanelMethod]({ stepId, taskId, courseId, review }) : undefined) || this.renderDefaultDetails({ stepId, taskId, courseId, review });
  },

  renderBackButton({ taskId, courseId, review, panel }, custombuttonClasses) {
    if (panel === 'teacher-read-only') {
      return (
        <TutorLink
          to="viewScores"
          key="step-back-scores"
          params={{ courseId }}
          className={custombuttonClasses || 'btn btn-default'}>
          {'\
    Back to Scores\
    '}
        </TutorLink>
      );
    } else {
      return (
        <TutorLink
          to="dashboard"
          key="step-back-sd"
          params={{ courseId }}
          className={custombuttonClasses || 'btn btn-primary'}>
          {'\
    Back to Dashboard\
    '}
        </TutorLink>
      );
    }
  },

  renderTeacherReadOnlyButtons({ taskId, courseId, review, panel }) {
    let backButton, continueButton;
    if (!(review != null ? review.length : undefined)) {
      continueButton = (typeof this.renderContinueButton === 'function' ? this.renderContinueButton() : undefined) || this.props.controlButtons;

      let backButtonClasses = 'btn btn-primary';
      if (continueButton != null) { backButtonClasses = 'btn btn-default'; }

      backButton = this.renderBackButton({ taskId, courseId, review, panel }, backButtonClasses);
    }

    return [
      continueButton,
      backButton,
    ];
  },

  renderDefaultButtons({ taskId, courseId, review, panel }) {
    return (typeof this.renderContinueButton === 'function' ? this.renderContinueButton() : undefined) || this.renderBackButton({ taskId, courseId });
  },

  renderButtons({ stepId, taskId, courseId, review }) {
    const panel = StepPanel.getPanel(stepId);
    const renderButtonsForPanelMethod = camelCase(`render-${panel}-buttons`);

    return (typeof this.renderFooterButtons === 'function' ? this.renderFooterButtons() : undefined) ||
      (typeof this[renderButtonsForPanelMethod] === 'function' ? this[renderButtonsForPanelMethod]({ taskId, courseId, review, panel }) : undefined) ||
      this.renderDefaultButtons({ taskId, courseId, review, panel });
  },

  getFooterClasses({ stepId, taskId, courseId, review }) {
    const { sections } = TaskStore.getDetails(taskId);

    let className = 'task-footer-details';
    if (sections.length) { className += ' has-sections'; }

    return className;
  },

  renderFooter({ stepId, taskId, courseId, review }) {
    const className = this.getFooterClasses({ stepId, taskId, courseId, review });
    return (
      <div>
        {this.renderButtons({ stepId, taskId, courseId, review })}
        <div className={className} key="step-footer">
          {this.renderTaskDetails({ stepId, taskId, courseId, review })}
        </div>
      </div>
    );
  },

  renderEndFooter({ stepId, taskId, courseId, review }) {
    const panel = StepPanel.getPanel(stepId);
    const className = this.getFooterClasses({ stepId, taskId, courseId, review });

    const backButton = this.renderBackButton({ taskId, courseId, review, panel }, 'btn btn-primary');
    const taskDetails = <div className={className} key="step-end-footer">
      {this.renderTaskDetails({ stepId, taskId, courseId, review })}
    </div>;

    return [
      backButton,
      taskDetails,
    ];
  },
};
