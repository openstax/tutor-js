import React from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';

const NoQuestionsTooltip = () => (
  <OverlayTrigger
    trigger="click"
    placement="top"
    overlay={
      <Popover id="reading-no-questions-popover">
        <Popover.Content>
          <p>Reading assignments are built by OpenStax Tutor. Readings include book content, 3 personalized questions per section, and 3 spaced practice questions per assignment.</p>
          <p>Questions are drawn from the Question Library, which you can get to from your dashboard. Remember — if you plan to exclude questions, do so before publishing.</p>
        </Popover.Content>
      </Popover>
    }
    rootClose={true}>
    <Button variant="link">
      Why can't I see the questions for this assignment?
    </Button>
  </OverlayTrigger>
);

export default NoQuestionsTooltip;
