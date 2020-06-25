import React from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';

const SelectionsTooltip = () => (
  <OverlayTrigger
    trigger="click"
    placement="bottom"
    overlay={
      <Popover id="homework-selections-popover">
        <Popover.Content>
          <p>These are questions selected by OpenStax Tutor's machine learning algorithms, using knowledge about each student's performance.</p>
          <p>Questions are drawn from the Question Library, accessible from your dashboard.</p>
        </Popover.Content>
      </Popover>
    }
    rootClose={true}>
    <Button variant="link" id="homework-selections-trigger">
      What are these?
    </Button>
  </OverlayTrigger>
);

export default SelectionsTooltip;
