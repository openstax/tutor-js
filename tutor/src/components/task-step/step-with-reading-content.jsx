import React from 'react';

import TaskStep from '../../models/task/step';
import { get } from 'lodash';
//import { TaskStepStore } from '../../flux/task-step';
import { ArbitraryHtmlAndMath, ChapterSectionMixin } from 'shared';
import CourseData from '../../helpers/course-data';
import { BookContentMixin, LinkContentMixin } from '../book-content-mixin';
import RelatedContent from '../related-content';
import Router from '../../helpers/router';

// TODO: will combine with below, after BookContentMixin clean up
const ReadingStepContent = React.createClass({
  displayName: 'ReadingStepContent',

  propTypes: {
    step: React.PropTypes.instanceOf(TaskStep).isRequired,

    courseId: React.PropTypes.string.isRequired,
    stepType: React.PropTypes.string.isRequired,
  },

  mixins: [BookContentMixin, ChapterSectionMixin],
  // used by BookContentMixin
  getSplashTitle() {
    return this.props.step.title;
  },
  getCnxId() {
    return this.props.step.cnxId;
  },

  shouldExcludeFrame() {
    return (
        this.props.step.type === 'interactive'
    );
  },

  shouldOpenNewTab() { return true; },
  render() {
    const { stepType } = this.props;
    const { id, content_html, related_content: [ related_content ] } = this.props.step;
    const { title, chapter_section } = ( related_content || {} );
    const { courseId } = Router.currentParams();

    return (

      <div className={`${stepType}-step`}>
        <div
          className={`${stepType}-content`}
          {...CourseData.getCourseDataProps(courseId)}>
          <RelatedContent
            contentId={id}
            title={title}
            chapter_section={chapter_section ? chapter_section.peek() : []}
          />
          <ArbitraryHtmlAndMath
            className="book-content"
            shouldExcludeFrame={this.shouldExcludeFrame}
            html={content_html} />
        </div>
      </div>

    );
  },
});

const StepContent = React.createClass({
  displayName: 'StepContent',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    stepType: React.PropTypes.string.isRequired,
  },

  mixins: [LinkContentMixin],
  // used by LinkContentMixin
  getCnxId() {
    return (
        TaskStepStore.getCnxId(this.props.id)
    );
  },

  render() {
    const { id, stepType } = this.props;
    const { content_html } = TaskStepStore.get(id);
    return (
      <div className={`${stepType}-step`}>
        <ArbitraryHtmlAndMath
          className={`${stepType}-content`}
          html={content_html}
          shouldExcludeFrame={this.shouldExcludeFrame} />
      </div>
    );
  },
});


export { StepContent, ReadingStepContent };

function __guard__(value, transform) {
  return (
      (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
  );
}
