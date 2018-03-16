import React from 'react';
import { uniqueId } from 'lodash';
import classnames from 'classnames';

import PerformanceForecast from '../../flux/performance-forecast';
import ChapterSectionType from './chapter-section-type';

import ButtonWithTip from '../buttons/button-with-tip';
import Practice from './practice';

export default class PracticeButton extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    sections: React.PropTypes.arrayOf(ChapterSectionType)
  };

  static defaultProps = { id: uniqueId('practice-button-tooltip-') };

  getTip = (props) => {
    if (props.isDisabled) {
      return 'No problems are available for practicing';
    }
  };

  render() {
    const { sections, courseId, id } = this.props;
    const page_ids = PerformanceForecast.Helpers.pagesForSections(sections);
    const classes = classnames('practice', this.props.practiceType);

    return (
      <Practice
        courseId={courseId}
        page_ids={page_ids}
      >
        <ButtonWithTip
          id={id}
          className={classes}
          getTip={this.getTip}
          placement='top'
        >
            {this.props.title}<i />
        </ButtonWithTip>
      </Practice>
    );
  }
};
