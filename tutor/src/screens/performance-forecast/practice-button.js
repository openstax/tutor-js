import PropTypes from 'prop-types';
import React from 'react';
import { uniqueId } from 'lodash';
import classnames from 'classnames';
import * as PerformanceForecast from '../../flux/performance-forecast';
import ChapterSectionType from './chapter-section-type';
import ButtonWithTip from '../../components/buttons/button-with-tip';
import Practice from './practice';

export default
class PracticeButton extends React.Component {

  static displayName = 'PracticeButton';

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    practiceType: PropTypes.string,
    title:    PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(ChapterSectionType),
  };

  id = uniqueId('practice-button-tooltip-');

  getTip = (props) => {
    if (props.isDisabled) {
      return 'No problems are available for practicing';
    }
    return '';
  };

  render() {
    const { sections, courseId } = this.props;
    const page_ids = PerformanceForecast.Helpers.pagesForSections(sections);
    const classes = classnames('practice', this.props.practiceType);

    return (
      <Practice courseId={courseId} page_ids={page_ids}>
        <ButtonWithTip
          id={this.id}
          variant="light"
          className={classes}
          getTip={this.getTip}
          placement="top"
        >
          {this.props.title}
        </ButtonWithTip>
      </Practice>
    );
  }
}
