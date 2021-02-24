import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import { first, pick, extend } from 'lodash';
import Exercise from '../helpers/exercise';

export default
class ExerciseIdentifierLink extends React.Component {

  static propTypes = {
      bookUUID: PropTypes.string.isRequired,
      exerciseId: PropTypes.string.isRequired,
      project: PropTypes.oneOf(['concept-coach', 'tutor']),
      related_content: PropTypes.arrayOf(PropTypes.shape({
          chapter_section: PropTypes.object,
          title: PropTypes.string,
      })),
      className: PropTypes.string,
      chapter_section: PropTypes.object,
      title: PropTypes.string,
  }

  static contextTypes = {
      oxProject: PropTypes.string,
      bookUUID:  PropTypes.string,
  }

  getLocationInfo() {
      const info = this.props.related_content ?
          first(this.props.related_content) : this.props;
      // book titles may have HTML in them, remove any tags
      const lo = pick(info, 'chapter_section', 'title');
      lo.title = (lo.title || '').replace(/(<([^>]+)>)/gi, '');
      if (lo.title.includes(lo.chapter_section.toString())) {
          lo.chapter_section = '';
      }
      return lo;
  }

  render() {
      const url = Exercise.troubleUrl(extend(
          this.getLocationInfo(),
          {
              exerciseId: this.props.exerciseId,
              project:    this.props.project || this.context.oxProject || 'tutor',
              bookUUID:   this.props.bookUUID || this.context.bookUUID,
          },
      ));

      return (
          <div className={cn('exercise-identifier-link', this.props.className)}>
        ID# {this.props.exerciseId} | <a target="_blank" tabIndex={-1} href={url}>
          Suggest a correction
              </a>
          </div>
      );
  }

}
