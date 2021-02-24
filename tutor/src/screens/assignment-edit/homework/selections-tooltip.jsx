import React from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';

const SelectionsTooltip = () => (
    <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
            <Popover id="homework-selections-popover">
                <Popover.Content>
                    <p>These are questions assigned by OpenStax Tutor based on each student’s performance and the material covered so far in the course. </p>
                    <p>Questions are automatically drawn from the Question Library, and each question is worth 1 point.</p>
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
