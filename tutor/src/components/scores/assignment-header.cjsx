React = require 'react'
BS = require 'react-bootstrap'


TutorLink = require '../link'
SortingHeader    = require './sorting-header'
Time   = require '../time'


AssignmentHeader = (props) ->
  {isConceptCoach, periodIndex, period_id, courseId, sort, onSort, dataType, columnIndex, width} = props
  heading = props.headings[columnIndex]

  getAverageCellWidth =
    if isConceptCoach
      'wide'
    else
      switch heading.type
        when 'reading' then 'wide'
        when 'external' then 'wide'
        else ''

  if heading.plan_id?
    linkParams =
      id: heading.plan_id
      courseId: courseId

    review =
      <span className="review-link #{getAverageCellWidth}">
        <Router.Link
          to='reviewTask'
          query={tab: @props.periodIndex}
          params={linkParams}>
          Review
        </Router.Link>
      </span>


    classAverage = heading.average_score

    if classAverage
      average =
        <span className="average #{getAverageCellWidth}">
          {(classAverage * 100).toFixed(0)}%
        </span>
    else
      if heading.type is 'homework'
        average =
          <span className="average">---</span>
      else if heading.type is 'external'
        p = heading.completion_rate
        percent = switch
          when (p < 1 and p > 0.99) then 99 # Don't round to 100% when it's not 100%!
          when (p > 0 and p < 0.01) then 1  # Don't round to 0% when it's not 0%!
          when (p > 1) then 100             # Don't let it go over 100%!
          else Math.round(p * 100)
        average =
          <span className="click-rate">
            {percent}% have clicked link
          </span>

    if heading.type is 'reading' or heading.type is 'external'
      label =
        <div className='scores-cell'>
          <SortingHeader
          type={heading.type}
          className='wide'
          sortKey={i}
          sortState={sort}
          onSort={onSort}>
            <div ref='completed' className='completed'>Progress</div>
          </SortingHeader>
        </div>
    else
      label =
        <div className='scores-cell'>
          <SortingHeader
          type={heading.type}
          sortKey={i}
          dataType={dataType}
          sortState={sort}
          onSort={onSort}>
            <div ref='score'>Score</div>
          </SortingHeader>
          <SortingHeader
          type={heading.type}
          sortKey={i}
          dataType={dataType}
          sortState={sort}
          onSort={onSort}>
            <div ref='completed'>Progress</div>
          </SortingHeader>
        </div>

    groupHeaderClass = if not isConceptCoach then 'hs' else ''

    groupHeaderDueDate =
      <div className='due'>due <Time date={heading.due_at}
      format='shortest'/></div>

    groupHeaderTooltip =
      <BS.Tooltip id="header-cell-title-#{i}">
        <div>{heading.title}</div>
      </BS.Tooltip>
    groupHeader =
      <BS.OverlayTrigger
        placement='top'
        delayShow={1000}
        delayHide={0}
        overlay={groupHeaderTooltip}>
        <span className="group-header">
          <div
          data-assignment-type="#{heading.type}"
          className="header-cell group title #{groupHeaderClass}">
            {heading.title}
          </div>
          {groupHeaderDueDate}
        </span>
      </BS.OverlayTrigger>

    customHeader = <div
      className='assignment-header-cell'>
      <div className='average-cell'>
        {average}
        {review unless isConceptCoach or heading.type is 'external'}
      </div>
      <div className='label-cell'>
        {label}
      </div>
    </div>
  cellWidth =
    if isConceptCoach
      'wide'
    else
      switch heading.type
        when 'reading' then 'wide'
        when 'external' then 'wide'
        else ''


  classAverage = heading.average_score

  if classAverage
    average =
      <span className="average #{cellWidth}">
        {(classAverage * 100).toFixed(0)}%
      </span>
  else
    if heading.type is 'homework'
      average =
        <span className="average">---</span>
    else if heading.type is 'external'
      p = heading.completion_rate
      percent = switch
        when (p < 1 and p > 0.99) then 99 # Don't round to 100% when it's not 100%!
        when (p > 0 and p < 0.01) then 1  # Don't round to 0% when it's not 0%!
        when (p > 1) then 100             # Don't let it go over 100%!
        else Math.round(p * 100)
      average =
        <span className="click-rate">
          {percent}% have clicked link
        </span>

  if heading.type is 'reading' or heading.type is 'external'
    label =
      <div className='scores-cell'>
        <SortingHeader
        type={heading.type}
        className='wide'
        sortKey={columnIndex}
        sortState={sort}
        onSort={onSort}>
          <div className='completed'>Progress</div>
        </SortingHeader>
      </div>
  else
    label =
      <div className='scores-cell'>
        <SortingHeader
        type={heading.type}
        sortKey={columnIndex}
        dataType={dataType}
        sortState={sort}
        onSort={onSort}>
          <div>Score</div>
        </SortingHeader>
        <SortingHeader
        type={heading.type}
        sortKey={columnIndex}
        dataType={dataType}
        sortState={sort}
        onSort={onSort}>
          <div>Progress</div>
        </SortingHeader>
      </div>

  groupHeaderClass = if not isConceptCoach then 'hs' else ''

  groupHeaderDueDate =
    <div className='due'>due <Time date={heading.due_at}
    format='shortest'/></div>

  groupHeaderTooltip =
    <BS.Tooltip id="header-cell-title-#{columnIndex}">
      <div>{heading.title}</div>
    </BS.Tooltip>


  <div className='assignment-header-cell'>
    <BS.OverlayTrigger
      placement='top'
      delayShow={1000}
      delayHide={0}
      overlay={groupHeaderTooltip}>
      <span className="group-header">
        <div
        data-assignment-type="#{heading.type}"
        className="header-cell group title #{groupHeaderClass}">
          {heading.title}
        </div>
        {groupHeaderDueDate}
      </span>
    </BS.OverlayTrigger>
    <div className='average-cell'>
      {average}
      {review unless isConceptCoach or heading.type is 'external'}
    </div>
    <div className='label-cell'>
      {label}
    </div>
  </div>

module.exports = AssignmentHeader
