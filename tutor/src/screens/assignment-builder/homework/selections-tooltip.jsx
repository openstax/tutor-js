import React from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';

export default class SelectionsTooltip extends React.Component {

  render() {
    return (
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={<Popover id="homework-selections-popover">
          <p>These are questions selected by OpenStax Tutor's machine learning algorithms, using knowledge about each student's performance.</p>
          <p>Questions are drawn from the Question Library, accessible from your dashboard.</p>
        </Popover>}
        rootClose={true}>
        <Button variant="link" id="homework-selections-trigger">
          What are these?
        </Button>
      </OverlayTrigger>
    );
  }
}
