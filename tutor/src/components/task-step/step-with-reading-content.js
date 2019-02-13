import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { TaskStepStore } from '../../flux/task-step';
import { AsyncButton, ArbitraryHtmlAndMath, ChapterSectionMixin } from 'shared';
import { get } from 'lodash';
import CourseData from '../../helpers/course-data';
import Courses from '../../models/courses-map';
import ChapterSection from '../../models/chapter-section';
import { BookContentMixin, LinkContentMixin } from '../book-content-mixin';
import RelatedContent from '../related-content';
import Router from '../../helpers/router';
import NoteWidget from '../notes';

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
    return get(TaskStepStore.get(this.props.id), '.title', '');
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
    console.log(related_content, chapter_section)
    return new ChapterSection(get(related_content, '[0].chapter_section', chapter_section));
  },

  getContentChapter() {
    return this.getContentChapterSection().chapter;
  },

  getContentSection() {
    return this.getContentChapterSection().section;
  },

  getContentTitle() {
    const { related_content } = TaskStepStore.get(this.props.id);
    return related_content && related_content[0] && related_content[0].title;
  },

  render() {
    const { id, stepType } = this.props;

    const { content_html } = TaskStepStore.get(id);
    const { courseId } = Router.currentParams();
    const course = Courses.get(courseId);

    return (
      <div className={`${stepType}-step`}>
        <div
          className={`${stepType}-content`}
          {...CourseData.getCourseDataProps(courseId)}>
          <RelatedContent
            contentId={id}
            chapter_section={this.getContentChapterSection()}
            title={this.getContentTitle()} />
          <NoteWidget
            course={course}
            chapter={this.getContentChapter()}
            section={this.getContentSection()}
            title={this.getContentTitle()}
            documentId={this.getCnxId()}
            pageType={stepType}
          >
            <ArbitraryHtmlAndMath
              className="book-content"
              shouldExcludeFrame={this.shouldExcludeFrame}
              html={content_html} />
          </NoteWidget>
          {this.renderNextStepLink()}
        </div>
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
