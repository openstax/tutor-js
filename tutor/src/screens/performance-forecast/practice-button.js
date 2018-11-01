import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import PerformanceForecast from '../../flux/performance-forecast';
import ChapterSectionType from './chapter-section-type';

import ButtonWithTip from '../buttons/button-with-tip';
import Practice from './practice';

export default class extends React.Component {
  static defaultProps = { id: _.uniqueId('practice-button-tooltip-') };

  static displayName = 'PracticeButton';

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    title:    PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(ChapterSectionType),
  };

  getTip = (props) => {
    if (props.isDisabled) { return 'No problems are available for practicing'; }
  };

  render() {
    const { sections, courseId, id } = this.props;
    const page_ids = PerformanceForecast.Helpers.pagesForSections(sections);
    const classes = classnames('practice', this.props.practiceType);

    return (
      <Practice courseId={courseId} page_ids={page_ids}>
        <ButtonWithTip id={id} className={classes} getTip={this.getTip} placement="top">
          {this.props.title}
          <i />
        </ButtonWithTip>
      </Practice>
    );
  }
}
