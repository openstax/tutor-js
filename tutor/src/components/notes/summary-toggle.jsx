import PropTypes from 'prop-types';
import React from 'react';
import { get } from 'lodash';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import Course from '../../models/course';
import TourRegion from '../tours/region';
import TourAnchor from '../tours/anchor';
import HighlightIcon from './highlight-icon';
import NotesUX from '../../models/notes/ux';
import { Button } from 'react-bootstrap';
import { styled, Theme } from 'vendor';

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  color: ${Theme.colors.navbars.control};
  background-color: transparent;
  border: none;
  white-space: nowrap;

  svg {
    height: 1.8rem;
    margin-right: 0.8rem;
  }
`;

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
          <StyledButton
            variant="plain"
            bsPrefix="summary-toggle"
            onClick={NotesUX.toggleSummary}
          >
            <HighlightIcon />
            My Highlights
          </StyledButton>
        </TourAnchor>
      </TourRegion>
    );
  }

}
