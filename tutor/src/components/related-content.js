import PropTypes from 'prop-types';
import React from 'react';
import { isArray, isString, isEmpty } from 'lodash';
import { StepTitleStore } from '../flux/step-title';
import ChapterSection from '../models/chapter-section';

class RelatedContent extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    hasLearningObjectives: PropTypes.bool.isRequired,
    isChapterSectionHidden: PropTypes.bool,
    chapter_section: PropTypes.instanceOf(ChapterSection).isRequired,
  };

  isIntro = () => {
    return (isArray(this.props.chapter_section) &&
      ((this.props.chapter_section.length === 1) ||
        (this.props.chapter_section[1] === 0))) ||
      (isString(this.props.chapter_section) &&
        (this.props.chapter_section.indexOf('.') === -1));
  };

  render() {

    const {
      title, chapter_section, isChapterSectionHidden, hasLearningObjectives,
    } = this.props;

    if (isEmpty(title) || this.isIntro()) { return null; }

    return (
      <h4
        className="related-content"
        data-has-learning-objectives={hasLearningObjectives}
      >
        <span className="part">
          {!isChapterSectionHidden &&
            <span className="section">
              {chapter_section.toString()}
              {' '}
            </span>}
          <span className="title">
            {title}
          </span>
        </span>

      </h4>
    );
  }
}

export default RelatedContent;
