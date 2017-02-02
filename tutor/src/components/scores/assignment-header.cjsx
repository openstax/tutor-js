React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'

TutorLink = require '../link'
SortingHeader    = require './sorting-header'
Time   = require '../time'

ReviewLink = (props) ->
  return null if props.isConceptCoach or props.heading.type is 'external' or not props.heading.plan_id?
  <span className="review-link #{props.cellWidth}">
    <TutorLink
      to='reviewTask'
      query={tab: props.periodIndex}
      params={id: props.heading.plan_id, courseId: props.courseId}
    >
      Review
    </TutorLink>
  </span>
ReviewLink.displayName = 'ReviewLink'

AverageLabel = (props) ->
  if props.average_score
    <span className="average #{props.cellWidth}">
      {(props.average_score * 100).toFixed(0)}%
    </span>
  else
    if props.heading.type is 'homework'
      <span className="average">---</span>
    else if props.heading.type is 'external'
      p = props.heading.completion_rate
      percent = switch
        when (p < 1 and p > 0.99) then 99 # Don't round to 100% when it's not 100%!
        when (p > 0 and p < 0.01) then 1  # Don't round to 0% when it's not 0%!
        when (p > 1) then 100             # Don't let it go over 100%!
        else Math.round(p * 100)

      <span className="click-rate">
        {percent}% have clicked link
      </span>
    else
      null
AverageLabel.displayName = 'AverageLabel'

getCellWidth = ({isConceptCoach, heading}) ->
  if isConceptCoach
    'wide'
  else
    switch heading.type
      when 'reading' then 'wide'
      when 'external' then 'wide'
      else ''

AssignmentSortingHeader = (props) ->
  {heading, dataType, columnIndex, sort, onSort} = props
  if heading.type is 'reading' or heading.type is 'external'
    <div className='scores-cell'>
      <SortingHeader
        type={heading.type}
        className='wide'
        sortKey={columnIndex}
        sortState={sort}
        onSort={onSort}
        dataType='score'
      >
        <div className='completed'>Progress</div>
      </SortingHeader>
    </div>
  else
    <div className='scores-cell'>
      <SortingHeader
        type={heading.type}
        sortKey={columnIndex}
        dataType='score'
        sortState={sort}
        onSort={onSort}
      >
        <div>Score</div>
      </SortingHeader>
      <SortingHeader
        type={heading.type}
        sortKey={columnIndex}
        dataType='completed'
        sortState={sort}
        onSort={onSort}
      >
        <div>Progress</div>
      </SortingHeader>
    </div>


AssignmentHeader = (props) ->
  {isConceptCoach, periodIndex, period_id, courseId, sort, onSort, columnIndex, width} = props
  heading = props.headings[columnIndex]

  cellWidth = getCellWidth({isConceptCoach, heading})

  <div className='header-cell-wrapper assignment'>
    <BS.OverlayTrigger
      placement='top'
      delayShow={1000}
      delayHide={0}
      overlay={
        <BS.Tooltip id="header-cell-title-#{columnIndex}">
          <div>{heading.title}</div>
        </BS.Tooltip>
      }
    >
      <div className="expanded-header-row">
        <div
          data-assignment-type="#{heading.type}"
          className={classnames('header-cell', 'group', 'title', {cc: isConceptCoach})}
        >
          {heading.title}
        </div>
        {<div className='due'>
          due <Time date={heading.due_at} format='shortest'/>
        </div> unless isConceptCoach}
      </div>
    </BS.OverlayTrigger>
    <div className='header-row'>
      <AverageLabel {...props} heading={heading} cellWidth={cellWidth} />
      <ReviewLink {...props} heading={heading} cellWidth={cellWidth} />
    </div>
    <div className='header-row short'>
      <AssignmentSortingHeader {...props} heading={heading} />
    </div>
  </div>

module.exports = AssignmentHeader
