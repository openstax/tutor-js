import React from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';

export default class NoQuestionsTooltip extends React.Component {

  render() {
    return (
      <OverlayTrigger
        trigger="click"
        placement="top"
        overlay={<Popover id="reading-no-questions-popover">
          <p>Reading assignments are built by OpenStax Tutor. Readings include book content, 3 personalized questions per section, and 3 spaced practice questions per assignment.</p>
          <p>Questions are drawn from the Question Library, which you can get to from your dashboard. Remember — if you plan to exclude questions, do so before publishing.</p>
        </Popover>}
        rootClose={true}>
        <Button variant="link">
          Why can't I see the questions for this assignment?
        </Button>
      </OverlayTrigger>
    );
  }
}
