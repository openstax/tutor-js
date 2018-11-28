import PropTypes from 'prop-types';
import React from 'react';
import { isArray, isString, isEmpty } from 'lodash';
import { StepTitleStore } from '../flux/step-title';
import ChapterSection from '../models/chapter-section';

class RelatedContent extends React.Component {
  static propTypes = {
    contentId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    hasLearningObjectives: PropTypes.bool,
    isCollated: PropTypes.bool,
    chapter_section: PropTypes.instanceOf(ChapterSection).isRequired,
  };

  isIntro = () => {
    return (isArray(this.props.chapter_section) &&
      ((this.props.chapter_section.length === 1) ||
      (this.props.chapter_section[1] === 0))) ||
      (isString(this.props.chapter_section) &&
      (this.props.chapter_section.indexOf('.') === -1));
  };

  renderSectionInfo() {
    const { title, chapter_section } = this.props;

    return (
      <span className="part">
        <span className="section">
          {chapter_section.toString()}
          {' '}
        </span>
        <span className="title">
          {title}
        </span>
      </span>
    );
  }

  renderCollated() {
    return <div dangerouslySetInnerHTML={{ __html: this.props.title }} />;
  }

  render() {
    let hasLearningObjectives;
    const { contentId, title, isCollated } = this.props;

    if (isEmpty(title) || this.isIntro()) { return null; }

    if (hasLearningObjectives == null) {
      hasLearningObjectives = StepTitleStore.hasLearningObjectives(contentId);
    }

    return (
      <h4
        className="related-content"
        data-has-learning-objectives={hasLearningObjectives}
      >
        {isCollated ? this.renderCollated() : this.renderSectionInfo()}
      </h4>
    );
  }
}

export default RelatedContent;
