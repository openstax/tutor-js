import React from 'react';
import { isNil } from 'lodash';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Icon from '../../components/icon';
import TutorLink from '../../components/link';
import SortingHeader from './sorting-header';
import Time from '../../components/time';
import TourAnchor from '../../components/tours/anchor';
import UX from './ux';

const ReviewLink = (props) => {
  const { ux } = props;
  if (props.isConceptCoach || (props.heading.type === 'external') || (props.heading.plan_id == null)) {
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
}


const AverageLabel = ({ heading }) => {
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
};

const AssignmentSortingHeader = (props) => {
  const { heading, dataType, columnIndex, sort, onSort } = props;
  if (heading.type === 'external') {
    return (
      <div className="scores-cell">
        <SortingHeader
          type={heading.type}
          className="wide"
          sortKey={columnIndex}
          sortState={sort}
          onSort={onSort}
          dataType="score">
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
        sortState={sort}
        onSort={onSort}>
        <div>
          Score
        </div>
      </SortingHeader>
      <SortingHeader
        type={heading.type}
        sortKey={columnIndex}
        dataType="completed"
        sortState={sort}
        onSort={onSort}>
        <div>
          Progress
        </div>
      </SortingHeader>
    </div>
  );
};

const TeacherAssignmentHeaderRow = function(props) {
  const { ux, heading } = props;

  if (!ux.course.isTeacher) {
    return null;
  }

  return (<div className="header-row overview-row">
    <AverageLabel {...props} heading={heading} />
    <ReviewLink {...props} heading={heading} />
  </div>
  );

}

const AssignmentHeader = function(props) {
  const { ux, columnIndex, isConceptCoach } = props;
  const heading = ux.period.data_headings[columnIndex];

  return (
    <div className={`header-cell-wrapper col-${columnIndex} assignment`}>
      <OverlayTrigger
        placement="top"
        delayShow={1000}
        delayHide={0}
        overlay={<Tooltip id={`header-cell-title-${columnIndex}`}>{heading.title}</Tooltip>}
      >
        <TourAnchor className="expanded-header-row" id={`scores-${heading.type}-header`}>
          <div
            data-assignment-type={`${heading.type}`}
            className={classnames('header-cell', 'group', 'title', { cc: isConceptCoach })}>
            {heading.title}
          </div>
          {!isConceptCoach ? <div className="due">due <Time date={heading.due_at} format="shortest" /></div> : null}
        </TourAnchor>
      </OverlayTrigger>
      <div className="header-row">
        <AssignmentSortingHeader {...props} heading={heading} />
      </div>
      <TeacherAssignmentHeaderRow {...props} heading={heading} />
    </div>
  );
};

AssignmentHeader.propTypes = {
  ux: React.PropTypes.instanceOf(UX).isRequired,

}
export default AssignmentHeader;
