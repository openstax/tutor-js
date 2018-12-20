import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Icon } from 'shared';

export default function AverageInfo() {
  const popover = (
    <Popover
      title="Class performance"
      id="scores-average-info-popover"
      className="scores-average-info-popover"
    >
      Class performance reflects class-wide averages of assignment scores and
      assignment progress. This metric includes scores and work completed by the due date.
    </Popover>
  );

  return (
    <OverlayTrigger
      ref="overlay"
      placement="right"
      trigger="click"
      rootClose={true}
      overlay={popover}
    >
      <Icon type="info-circle" />
    </OverlayTrigger>
  );
}
