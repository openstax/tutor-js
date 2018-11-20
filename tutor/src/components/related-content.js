import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

import { ChapterSectionMixin } from 'shared';

import { StepTitleStore } from '../flux/step-title';

const RelatedContent = createReactClass({
  displayName: 'RelatedContent',

  propTypes: {
    contentId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    hasLearningObjectives: PropTypes.bool,

    chapter_section: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]).isRequired,
  },

  mixins: [ChapterSectionMixin],

  isIntro() {
    return (_.isArray(this.props.chapter_section) &&
      ((this.props.chapter_section.length === 1) ||
      (this.props.chapter_section[1] === 0))) ||
      (_.isString(this.props.chapter_section) &&
      (this.props.chapter_section.indexOf('.') === -1));
  },

  render() {
    let hasLearningObjectives;
    const { title, contentId, chapter_section } = this.props;

    if (_.isEmpty(title) || this.isIntro()) { return null; }

    const section = this.sectionFormat(chapter_section);

    if (hasLearningObjectives == null) {
      hasLearningObjectives = StepTitleStore.hasLearningObjectives(contentId);
    }

    return (
      <h4
        className="related-content"
        data-has-learning-objectives={hasLearningObjectives}>
        <span className="part">
          <span className="section">
            {section}
            {' '}
          </span>
          <span className="title">
            {title}
          </span>
        </span>
      </h4>
    );
  },
});

export default RelatedContent;
