import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import first from 'lodash/first';
import pick from 'lodash/pick';
import extend from 'lodash/extend';

import Exercise from '../helpers/exercise';
import ChapterSectionMixin from './chapter-section-mixin';

const ExerciseIdentifierLink = createReactClass({
  displayName: 'ExerciseIdentifierLink',
  mixins: [ChapterSectionMixin],

  propTypes: {
    bookUUID: PropTypes.string,
    exerciseId: PropTypes.string.isRequired,
    project: PropTypes.oneOf(['concept-coach', 'tutor']),

    related_content: PropTypes.arrayOf(PropTypes.shape({
      chapter_section: PropTypes.arrayOf(PropTypes.number),
      title: PropTypes.string,
    })),

    chapter_section: PropTypes.arrayOf(PropTypes.number),
    title: PropTypes.string,
  },

  contextTypes: {
    oxProject: PropTypes.string,
    bookUUID:  PropTypes.string,
  },

  getLocationInfo() {
    const info = this.props.related_content ?
      first(this.props.related_content)
      :
      this.props;

    return pick(info, 'chapter_section', 'title');
  },

  render() {
    const url = Exercise.troubleUrl(extend(
      this.getLocationInfo(),
      {
        exerciseId: this.props.exerciseId,
        project:    this.props.project || this.context.oxProject,
        bookUUID:   this.props.bookUUID || this.context.bookUUID,
      },
    ));

    return (
      <div>
        <span className="exercise-identifier-link">
          {'\
    ID# '}
          {this.props.exerciseId}
          {' | '}
          <a target="_blank" tabIndex={-1} href={url}>
            Suggest a correction
          </a>
        </span>
      </div>
    );
  },
});
export default ExerciseIdentifierLink;
