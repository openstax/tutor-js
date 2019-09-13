import PropTypes from 'prop-types';
import React from 'react';
import { get } from 'lodash';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import cn from 'classnames';
import Course from '../../models/course';
import TourRegion from '../tours/region';
import TourAnchor from '../tours/anchor';
import HighlightIcon from './highlight-icon';
import NotesUX from '../../models/notes/ux';

export default
@observer
class NoteSummaryToggle extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
    type: PropTypes.oneOf(['reading', 'refbook']),
    model: PropTypes.shape({
      canAnnotate: PropTypes.bool,
    }),
  }

  @computed get isViewable() {
    const { course, model } = this.props;
    return get(model || course, 'canAnnotate', false);
  }

  render() {
    if (!this.isViewable) { return null; }

    return (
      <TourRegion
        id="student-highlighting-reading"
        courseId={this.props.course.id}
      >
        <TourAnchor id="student-highlighting-button">
          <button
            onClick={NotesUX.toggleSummary}
            className={cn('note-summary-toggle', {
              active: NotesUX.isSummaryVisible,
            })}
          >
            <HighlightIcon />
          </button>
        </TourAnchor>
      </TourRegion>
    );
  }

}
