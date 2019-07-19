import PropTypes from 'prop-types';
import React from 'react';
import { isNil } from 'lodash';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import TutorLink from '../../components/link';
import SortingHeader from './sorting-header';
import Time from '../../components/time';
import TourAnchor from '../../components/tours/anchor';
import UX from './ux';

const ReviewLink = observer((props) => {
  const { ux } = props;
  if (props.heading.type === 'external' || props.heading.plan_id == null) {
    return null;
  }
  return (
    <span className="review-link">
      <TutorLink
        to="reviewTask"
        query={{ tab: props.periodIndex }}
        params={{ id: props.heading.plan_id, courseId: ux.course.id }}
      >
        Review
      </TutorLink>
    </span>
  );
});


const AverageLabel = observer(({ heading }) => {
  if (heading.type === 'external') {
    const p = heading.average_progress || 0;
    let percent;
    if (p < 1 && p > 0.99) {
      percent = 99; // Don't round to 100% when it's not 100%!
    } else if (p > 0 && p < 0.01) {
      percent = 1; // Don't round to 0% when it's not 0%!
    } else if (p > 1) {
      percent = 100; // Don't let it go over 100%!
    } else {
      percent = Math.round(p * 100);
    }
    return (
      <span className="click-rate">
        {heading.isDue ? `${percent}% clicked on time` : '---'}
      </span>
    );
  }

  if (!isNil(heading.average_score)) {
    return (
      <span className="average">
        {(heading.average_score * 100).toFixed(0)}%
      </span>
    );
  }

  return (
    <span className="average">
      ---
    </span>
  );
});

const AssignmentSortingHeader = observer((props) => {
  const { heading, ux, columnIndex } = props;
  if (heading.type === 'external') {
    return (
      <div className="scores-cell">
        <SortingHeader
          type={heading.type}
          className="wide"
          sortKey={columnIndex}
          dataType="score"
          ux={ux}
        >
          <div className="completed">
            Progress
          </div>
        </SortingHeader>
      </div>
    );
  }
  return (
    <div className="scores-cell">
      <SortingHeader
        type={heading.type}
        sortKey={columnIndex}
        dataType="score"
        ux={ux}
      >
        <div>
          Score
        </div>
      </SortingHeader>
      <SortingHeader
        type={heading.type}
        sortKey={columnIndex}
        dataType="completed"
        ux={ux}
      >
        <div>
          Progress
        </div>
      </SortingHeader>
    </div>
  );
});

const TeacherAssignmentHeaderRow = observer((props) => {
  const { ux, heading } = props;

  if (!ux.course.currentRole.isTeacher) {
    return null;
  }

  return (<div className="header-row overview-row">
    <AverageLabel {...props} heading={heading} />
    <ReviewLink {...props} heading={heading} />
  </div>
  );
});

const AssignmentHeader = observer((props) => {
  const { ux, columnIndex } = props;
  const heading = ux.period.data_headings[columnIndex];
  return (
    <div
      className="header-cell-wrapper assignment"
      data-column={columnIndex}
    >
      <OverlayTrigger
        placement="top"
        delayShow={1000}
        delayHide={0}
        overlay={<Tooltip id={`header-cell-title-${columnIndex}`}>{heading.title}</Tooltip>}
      >
        <TourAnchor className="expanded-header-row" id={`scores-${heading.type}-header`}>
          <div
            data-assignment-type={`${heading.type}`}
            className={classnames('header-cell', 'group', 'title')}
          >
            {heading.title}
          </div>
          <div className="due">
            due <Time date={heading.due_at} format="shortest" />
          </div>
        </TourAnchor>
      </OverlayTrigger>
      <div className="header-row">
        <AssignmentSortingHeader {...props} heading={heading} />
      </div>
      <TeacherAssignmentHeaderRow {...props} heading={heading} />
    </div>
  );
});

AssignmentHeader.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default AssignmentHeader;
