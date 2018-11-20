import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { Button } from 'react-bootstrap';
import { TaskStepStore } from '../../flux/task-step';
import { TaskPanelStore } from '../../flux/task-panel';
import { AsyncButton, ArbitraryHtmlAndMath, ChapterSectionMixin } from 'shared';
import CourseData from '../../helpers/course-data';
import { BookContentMixin, LinkContentMixin } from '../book-content-mixin';
import RelatedContent from '../related-content';
import Router from '../../helpers/router';
import AnnotationWidget from '../annotations/annotation';
import { Icon } from 'shared';

// TODO: will combine with below, after BookContentMixin clean up
const ReadingStepContent = createReactClass({
  displayName: 'ReadingStepContent',

  propTypes: {
    id: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    stepType: PropTypes.string.isRequired,
  },

  mixins: [BookContentMixin, ChapterSectionMixin],

  // used by BookContentMixin
  getSplashTitle() {
    return __guard__(TaskStepStore.get(this.props.id), x => x.title) || '';
  },

  getCnxId() {
    return TaskStepStore.getCnxId(this.props.id);
  },

  shouldExcludeFrame() {
    return this.props.stepType === 'interactive';
  },

  getInitialState() {
    return { isContinuing: false };
  },

  componentDidMount() { return this.isMounted = true; },
  componentWillUnmount() { return this.isMounted = false; },

  onContinue() {
    this.setState({ isContinuing: true });
    return this.props.onContinue().then(() => {
      if (this.isMounted) { return this.setState({ isContinuing: false }); }
    });
  },

  renderNextStepLink() {
    if (!this.props.onContinue) { return null; }

    return (
      <AsyncButton
        variant="primary"
        isWaiting={this.state.isContinuing}
        waitingText="Loading…"
        onClick={this.onContinue}>
        {'\
    Continue\
    '}
      </AsyncButton>
    );
  },

  shouldOpenNewTab() { return true; },

  getContentChapterSection() {
    const { chapter_section, related_content } = TaskStepStore.get(this.props.id);
    return (
      related_content &&
      related_content[0] &&
      related_content[0].chapter_section
    ) || chapter_section || [];
  },

  getContentChapter() {
    return __guard__(this.getContentChapterSection(), x => x[0]);
  },

  getContentSection() {
    return __guard__(this.getContentChapterSection(), x => x[1]);
  },

  // || look up by @getContentChapterSection()
  getContentTitle() {
    const { related_content } = TaskStepStore.get(this.props.id);
    return related_content && related_content[0] && related_content[0].title;
  },

  render() {
    const { id, stepType } = this.props;

    const { content_html } = TaskStepStore.get(id);
    const { courseId } = Router.currentParams();

    return (
      <div className={`${stepType}-step`}>
        <div
          className={`${stepType}-content`}
          {...CourseData.getCourseDataProps(courseId)}>
          <RelatedContent
            contentId={id}
            chapter_section={this.getContentChapterSection()}
            title={this.getContentTitle()} />
          <ArbitraryHtmlAndMath
            className="book-content"
            shouldExcludeFrame={this.shouldExcludeFrame}
            html={content_html} />
          {this.renderNextStepLink()}
        </div>
        <AnnotationWidget
          courseId={courseId}
          chapter={this.getContentChapter()}
          section={this.getContentSection()}
          title={this.getContentTitle()}
          documentId={this.getCnxId()}
          pageType={stepType} />
      </div>
    );
  },
});

const StepContent = createReactClass({
  displayName: 'StepContent',

  propTypes: {
    id: PropTypes.string.isRequired,
    stepType: PropTypes.string.isRequired,
  },

  mixins: [LinkContentMixin],

  // used by LinkContentMixin
  getCnxId() {
    return TaskStepStore.getCnxId(this.props.id);
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
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}